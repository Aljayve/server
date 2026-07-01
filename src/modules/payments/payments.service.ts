import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { User, UserDocument } from '../users/schemas/user.schema';
import { PLANS } from '../../common/config/plan.config';

@Injectable()
export class PaymentsService {
    private readonly paymongoApi: string;

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly configService: ConfigService,
    ) {
        this.paymongoApi = 'https://api.paymongo.com/v1';
    }

    private get apiKey(): string {
        return this.configService.get<string>('PAYMONGO_SECRET_KEY') ?? '';
    }

    private get successUrl(): string {
        return this.configService.get<string>('PAYMENT_SUCCESS_URL') ?? 'http://localhost:5173/dashboard/settings/payment-callback?status=success';
    }

    private get cancelUrl(): string {
        return this.configService.get<string>('PAYMENT_CANCEL_URL') ?? 'http://localhost:5173/dashboard/settings/payment-callback?status=cancel';
    }

    private get webhookSecret(): string {
        return this.configService.get<string>('PAYMONGO_WEBHOOK_SECRET') ?? '';
    }

    async createCheckoutSession(userId: string, planId: string) {
        const plan = PLANS[planId];
        if (!plan || plan.price <= 0) {
            throw new HttpException('Invalid plan', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const amount = plan.price * 100;

        try {
            const response: any = await axios.post(
                `${this.paymongoApi}/checkout_sessions`,
                {
                    data: {
                        attributes: {
                            billing: {
                                name: `${user.firstName} ${user.lastName}`,
                                email: user.email,
                            },
                            line_items: [
                                {
                                    name: `${plan.name} Plan`,
                                    amount,
                                    currency: 'PHP',
                                    quantity: 1,
                                    description: `ResumeAI ${plan.name} plan - ${plan.features.slice(0, 3).join(', ')}`,
                                },
                            ],
                            payment_method_types: ['gcash', 'grab_pay', 'maya', 'card'],
                            success_url: `${this.successUrl}&session_id={CHECKOUT_SESSION_ID}`,
                            cancel_url: this.cancelUrl,
                            metadata: {
                                user_id: userId,
                                plan_id: planId,
                            },
                        },
                    },
                },
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            const session = response.data.data;
            return {
                checkoutUrl: session.attributes.checkout_url,
                sessionId: session.id,
            };
        } catch (err: any) {
            const message = err?.response?.data?.errors?.[0]?.detail ?? 'Failed to create checkout session';
            throw new HttpException(message, HttpStatus.BAD_GATEWAY);
        }
    }

    async verifyPayment(sessionId: string) {
        try {
            const response: any = await axios.get(
                `${this.paymongoApi}/checkout_sessions/${sessionId}`,
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
                    },
                },
            );

            const session = response.data.data;
            const attrs = session.attributes;

            if (attrs.payment_intent?.attributes?.status === 'paid') {
                const userId = attrs.metadata?.user_id;
                const planId = attrs.metadata?.plan_id;

                if (userId && planId) {
                    await this.userModel.findByIdAndUpdate(userId, { plan: planId });
                    return { verified: true, plan: planId };
                }
            }

            return { verified: false };
        } catch {
            throw new HttpException('Payment verification failed', HttpStatus.BAD_GATEWAY);
        }
    }

    async handleWebhook(payload: any) {
        const eventType = payload?.data?.attributes?.type;
        if (eventType === 'checkout_session.payment.paid') {
            const session = payload?.data?.attributes?.data?.object;
            const userId = session?.metadata?.user_id;
            const planId = session?.metadata?.plan_id;
            if (userId && planId) {
                await this.userModel.findByIdAndUpdate(userId, { plan: planId });
            }
        }
        return { received: true };
    }
}
