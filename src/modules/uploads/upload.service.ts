import {
    BadRequestException,
    Injectable,
} from "@nestjs/common";

import { UploadApiResponse } from "cloudinary";
import * as streamifier from "streamifier";

import cloudinary from "../../common/utils/cloudinary";

interface MulterFile {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}

@Injectable()
export class UploadService {

    private async uploadImage(
        file: MulterFile,
        folder: string,
    ): Promise<UploadApiResponse> {

        if (!file) {
            throw new BadRequestException(
                "No file uploaded",
            );
        }

        return new Promise(
            (resolve, reject) => {

                const stream =
                    cloudinary.uploader.upload_stream(
                        {
                            folder,
                        },

                        (error, result) => {

                            if (error) {
                                return reject(error);
                            }

                            resolve(result!);
                        },
                    );

                streamifier.createReadStream(
                    file.buffer,
                ).pipe(stream);

            },
        );
    }

    async uploadAvatar(
        file: MulterFile,
    ): Promise<UploadApiResponse> {
        return this.uploadImage(
            file,
            "resume-ai/avatars",
        );
    }

    async uploadResumePhoto(
        file: MulterFile,
    ): Promise<UploadApiResponse> {
        return this.uploadImage(
            file,
            "resume-ai/resume-photos",
        );
    }

    async deleteImage(
        publicId: string,
    ) {
        return cloudinary.uploader.destroy(
            publicId,
        );
    }
}