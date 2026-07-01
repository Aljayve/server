import { Module } from '@nestjs/common';
import { JobMatcherController } from './job-matcher.controller';
import { JobMatcherService } from './job-matcher.service';
import { ResumesModule } from '../resumes/resumes.module';

@Module({
    imports: [ResumesModule],
    controllers: [JobMatcherController],
    providers: [JobMatcherService],
})
export class JobMatcherModule { }
