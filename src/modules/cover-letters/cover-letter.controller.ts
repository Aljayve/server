import { Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import { CoverLetterService } from "./cover-letter.service";
import { GenerateCoverLetterDto } from "./dto/generate-cover-letter.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import type { Response } from "express";

@Controller("cover-letters")
export class CoverLetterController {
    constructor(private readonly coverLetterService: CoverLetterService) {}

    @Post("generate")
    @UseGuards(JwtAuthGuard)
    generate(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: GenerateCoverLetterDto,
    ) {
        return this.coverLetterService.generate(user.userId, dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@CurrentUser() user: AuthenticatedUser) {
        return this.coverLetterService.findAll(user.userId);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    findOne(
        @CurrentUser() user: AuthenticatedUser,
        @Param("id") id: string,
    ) {
        return this.coverLetterService.findOne(id, user.userId);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    remove(
        @CurrentUser() user: AuthenticatedUser,
        @Param("id") id: string,
    ) {
        return this.coverLetterService.remove(id, user.userId);
    }

    @Post(":id/export/pdf")
    @UseGuards(JwtAuthGuard)
    async exportPdf(
        @CurrentUser() user: AuthenticatedUser,
        @Param("id") id: string,
        @Res() res: Response,
    ) {
        const pdf = await this.coverLetterService.exportPdf(id, user.userId);
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="cover-letter.pdf"',
            "Content-Length": pdf.length,
        });
        res.send(pdf);
    }

    @Post(":id/export/docx")
    @UseGuards(JwtAuthGuard)
    async exportDocx(
        @CurrentUser() user: AuthenticatedUser,
        @Param("id") id: string,
        @Res() res: Response,
    ) {
        const docx = await this.coverLetterService.exportDocx(id, user.userId);
        res.set({
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": 'attachment; filename="cover-letter.docx"',
            "Content-Length": docx.length,
        });
        res.send(docx);
    }
}
