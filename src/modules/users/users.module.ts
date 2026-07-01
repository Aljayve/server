import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Resume, ResumeSchema } from '../resumes/schemas/resume.schema';
import { CoverLetter, CoverLetterSchema } from '../cover-letters/schemas/cover-letter.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UploadModule } from '../uploads/upload.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Resume.name, schema: ResumeSchema },
            { name: CoverLetter.name, schema: CoverLetterSchema },
        ]),
        UploadModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService, MongooseModule],
})
export class UsersModule { }
