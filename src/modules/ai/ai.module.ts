import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppSettings, AppSettingsSchema } from '../admin/schemas/app-settings.schema';
import { AiService } from './ai.service';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AppSettings.name, schema: AppSettingsSchema },
        ]),
    ],
    providers: [AiService],
    exports: [AiService],
})
export class AiModule { }
