import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AtsService } from "./ats.service";
import { AnalyzeResumeDto } from "./dto/analyze-resume.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@Controller('ats')
export class AtsController {
    constructor(private readonly atsService: AtsService) { }

    @Post('analyze')
    @UseGuards(JwtAuthGuard)
    analyze(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: AnalyzeResumeDto,
    ) {
        return this.atsService.analyze(user.userId, dto);
    }
}
