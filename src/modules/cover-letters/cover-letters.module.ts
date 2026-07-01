import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CoverLetterController } from "./cover-letter.controller";
import { CoverLetterService } from "./cover-letter.service";
import { CoverLetter, CoverLetterSchema } from "./schemas/cover-letter.schema";
import { ResumesModule } from "../resumes/resumes.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CoverLetter.name, schema: CoverLetterSchema },
        ]),
        ResumesModule,
        UsersModule,
    ],
    controllers: [CoverLetterController],
    providers: [CoverLetterService],
})
export class CoverLettersModule {}
