import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

@Controller("uploads")
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
    ) { }

    @Post("avatar")
    @UseGuards(JwtAuthGuard)

    @UseInterceptors(

        FileInterceptor("file", {
            storage: memoryStorage(),

            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )

    uploadAvatar(
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        return this.uploadService.uploadAvatar(
            file,
        );
    }
}