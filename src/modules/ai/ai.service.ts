import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { AppSettings, AppSettingsDocument } from '../admin/schemas/app-settings.schema';

export interface AiConfig {
    enabled: boolean;
    provider: string;
    apiKey: string;
    customBaseUrl: string;
    customModel: string;
}

export interface AiGenerateOptions {
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
}

@Injectable()
export class AiService implements OnModuleInit {
    private readonly logger = new Logger(AiService.name);
    private config: AiConfig = { enabled: false, provider: 'OpenAI', apiKey: '', customBaseUrl: '', customModel: '' };

    constructor(
        @InjectModel(AppSettings.name) private readonly appSettingsModel: Model<AppSettingsDocument>,
    ) { }

    async onModuleInit() {
        await this.refreshConfig();
    }

    async refreshConfig() {
        const settings = await this.appSettingsModel.findOne().lean().exec();
        if (settings) {
            this.config = {
                enabled: settings.aiEnabled ?? false,
                provider: settings.aiProvider ?? 'OpenAI',
                apiKey: settings.aiApiKey ?? '',
                customBaseUrl: settings.aiCustomBaseUrl ?? '',
                customModel: settings.aiCustomModel ?? '',
            };
        }
    }

    getConfig(): AiConfig {
        return { ...this.config };
    }

    async isAvailable(): Promise<boolean> {
        await this.refreshConfig();
        return this.config.enabled && !!this.config.apiKey;
    }

    async generateText(prompt: string, options?: AiGenerateOptions): Promise<string> {
        await this.refreshConfig();

        if (!this.config.enabled) {
            throw new Error('AI features are disabled by admin');
        }
        if (!this.config.apiKey) {
            throw new Error('AI API key not configured');
        }

        const systemPrompt = options?.systemPrompt ?? 'You are a helpful AI assistant for a resume-building platform.';

        switch (this.config.provider) {
            case 'OpenAI':
                return this.callOpenAI(prompt, systemPrompt, options);
            case 'Anthropic':
                return this.callAnthropic(prompt, systemPrompt, options);
            case 'Google':
                return this.callGoogle(prompt, systemPrompt, options);
            default:
                return this.callCustomOpenAI(prompt, systemPrompt, options);
        }
    }

    private async callOpenAI(
        prompt: string,
        systemPrompt: string,
        options?: AiGenerateOptions,
    ): Promise<string> {
        try {
            const response: any = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt },
                    ],
                    max_tokens: options?.maxTokens ?? 1024,
                    temperature: options?.temperature ?? 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.config.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            return response.data.choices[0].message.content.trim();
        } catch (err: any) {
            const data = err?.response?.data as any;
            const message = data?.error?.message ?? err.message;
            this.logger.error(`OpenAI API error: ${message}`);
            throw new Error(`AI API error: ${message}`);
        }
    }

    private async callAnthropic(
        prompt: string,
        systemPrompt: string,
        options?: AiGenerateOptions,
    ): Promise<string> {
        try {
            const response: any = await axios.post(
                'https://api.anthropic.com/v1/messages',
                {
                    model: 'claude-3-haiku-20240307',
                    max_tokens: options?.maxTokens ?? 1024,
                    system: systemPrompt,
                    messages: [{ role: 'user', content: prompt }],
                },
                {
                    headers: {
                        'x-api-key': this.config.apiKey,
                        'anthropic-version': '2023-06-01',
                        'Content-Type': 'application/json',
                    },
                },
            );

            return response.data.content[0].text.trim();
        } catch (err: any) {
            const data = err?.response?.data as any;
            const message = data?.error?.message ?? err.message;
            this.logger.error(`Anthropic API error: ${message}`);
            throw new Error(`AI API error: ${message}`);
        }
    }

    private async callGoogle(
        prompt: string,
        systemPrompt: string,
        options?: AiGenerateOptions,
    ): Promise<string> {
        try {
            const response: any = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.config.apiKey}`,
                {
                    contents: [{
                        parts: [{ text: `${systemPrompt}\n\n${prompt}` }],
                    }],
                    generationConfig: {
                        maxOutputTokens: options?.maxTokens ?? 1024,
                        temperature: options?.temperature ?? 0.7,
                    },
                },
            );

            return response.data.candidates[0].content.parts[0].text.trim();
        } catch (err: any) {
            const data = err?.response?.data as any;
            const message = data?.error?.message ?? err.message;
            this.logger.error(`Google AI API error: ${message}`);
            throw new Error(`AI API error: ${message}`);
        }
    }

    private async callCustomOpenAI(
        prompt: string,
        systemPrompt: string,
        options?: AiGenerateOptions,
    ): Promise<string> {
        const baseUrl = this.config.customBaseUrl.replace(/\/$/, '');
        const model = this.config.customModel || 'gpt-3.5-turbo';

        try {
            const response: any = await axios.post(
                `${baseUrl}/chat/completions`,
                {
                    model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt },
                    ],
                    max_tokens: options?.maxTokens ?? 1024,
                    temperature: options?.temperature ?? 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.config.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            return response.data.choices[0].message.content.trim();
        } catch (err: any) {
            const data = err?.response?.data as any;
            const message = data?.error?.message ?? err.message;
            this.logger.error(`Custom AI API error: ${message}`);
            throw new Error(`AI API error: ${message}`);
        }
    }

    async improveWithAi<T>(fn: () => T, aiFn: () => Promise<string>, parser: (raw: string) => T): Promise<T> {
        if (await this.isAvailable()) {
            try {
                const raw = await aiFn();
                return parser(raw);
            } catch {
                return fn();
            }
        }
        return fn();
    }
}
