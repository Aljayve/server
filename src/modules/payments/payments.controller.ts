import { Controller, Post, Get, Body, Param, UseGuards, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('checkout')
    @UseGuards(JwtAuthGuard)
    async createCheckout(
        @CurrentUser() user: AuthenticatedUser,
        @Body('planId') planId: string,
    ) {
        return this.paymentsService.createCheckoutSession(user.userId, planId);
    }

    @Get('verify')
    @UseGuards(JwtAuthGuard)
    async verify(
        @Query('session_id') sessionId: string,
    ) {
        return this.paymentsService.verifyPayment(sessionId);
    }

    @Post('webhook')
    async webhook(@Body() payload: any) {
        return this.paymentsService.handleWebhook(payload);
    }
}
