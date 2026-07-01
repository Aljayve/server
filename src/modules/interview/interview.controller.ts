import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { InterviewService } from "./interview.service";
import { GenerateQuestionsDto } from "./dto/generate-questions.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@Controller("interview")
export class InterviewController {
    constructor(private readonly interviewService: InterviewService) {}

    @Post("generate")
    @UseGuards(JwtAuthGuard)
    generate(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: GenerateQuestionsDto,
    ) {
        return this.interviewService.generate(user.userId, dto);
    }
}
