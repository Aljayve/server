import { Module } from "@nestjs/common";
import { InterviewController } from "./interview.controller";
import { InterviewService } from "./interview.service";
import { ResumesModule } from "../resumes/resumes.module";

@Module({
    imports: [ResumesModule],
    controllers: [InterviewController],
    providers: [InterviewService],
})
export class InterviewModule {}
