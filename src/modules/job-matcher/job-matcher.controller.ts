import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JobMatcherService } from './job-matcher.service';
import { MatchJobDto } from './dto/match-job.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@Controller('job-matcher')
export class JobMatcherController {
    constructor(private readonly jobMatcherService: JobMatcherService) { }

    @Post('match')
    @UseGuards(JwtAuthGuard)
    async match(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: MatchJobDto,
    ) {
        return this.jobMatcherService.match(user.userId, dto.resumeId, dto.jobDescription);
    }
}
