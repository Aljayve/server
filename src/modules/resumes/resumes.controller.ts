import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors, UploadedFile, Req } from "@nestjs/common";
import { ResumesService } from "./resumes.service";
import { CreateResumeDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { UploadService } from "../uploads/upload.service";
import { UpdatePersonalInfoDto } from "./dto/sections/update-personal-info.dto";
import { AuthGuard } from "@nestjs/passport";
import { UpdateSummaryDto } from "./dto/sections/update-summary.dto";
import { CreateExperienceDto } from "./dto/experience/create-experience.dto";
import { UpdateExperienceDto } from "./dto/experience/update-experience.dto";
import { CreateEducationDto } from "./dto/education/create-education.dto";
import { UpdateEducationDto } from "./dto/education/update-education.dto";
import { CreateProjectDto } from "./dto/project/create-project.dto";
import { CreateCertificationDto } from "./dto/certification/create-certification.dto";
import { UpdateCertificationDto } from "./dto/certification/update-certification.dto";
import { UpdateProjectDto } from "./dto/project/update-project.dto";
import { CreateLanguageDto } from "./dto/language/create-language.dto";
import { UpdateLanguageDto } from "./dto/language/update-language.dto";
import { CreateAwardDto } from "./dto/award/create-award.dto";
import { UpdateAwardDto } from "./dto/award/update-award.dto";
import { CreateReferenceDto } from "./dto/reference/create-reference.dto";
import { UpdateReferenceDto } from "./dto/reference/update-reference.dto";
import { CreateCustomSectionDto } from "./dto/custom-section/create-custom-section.dto";
import { UpdateCustomSectionDto } from "./dto/custom-section/update-custom-section.dto";
import { UpdateSkillsDto } from "./dto/sections/update-skills.dto";

@Controller("resumes")
export class ResumesController {
    constructor(
        private readonly resumesService: ResumesService,
        private readonly uploadService: UploadService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: CreateResumeDto,
    ) {
        return this.resumesService.create(
            user.userId,
            dto,
        );
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.resumesService.findAll(
            user.userId,
        );
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    findOne(
        @CurrentUser() user: AuthenticatedUser,
        @Param("id") id: string,
    ) {
        return this.resumesService.findOne(
            id,
            user.userId,
        );
    }

    @Patch("photo")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor("file", {
            storage: memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    async uploadPhoto(
        @CurrentUser() user: AuthenticatedUser,
        @Body("resumeId") resumeId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const result = await this.uploadService.uploadResumePhoto(file);
        return this.resumesService.updatePhoto(
            resumeId,
            user.userId,
            result.secure_url,
        );
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    update(
        @CurrentUser() user: AuthenticatedUser,
        @Param("id") id: string,
        @Body() dto: UpdateResumeDto,
    ) {
        return this.resumesService.update(
            id,
            user.userId,
            dto,
        );
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    remove(
        @CurrentUser() user: AuthenticatedUser,
        @Param("id") id: string,
    ) {
        return this.resumesService.remove(
            id,
            user.userId,
        );
    }

    @Patch(":id/personal-info")
    @UseGuards(AuthGuard("jwt"))
    async updatePersonalInfo(
        @Param("id") id: string,
        @CurrentUser() user,
        @Body() dto: UpdatePersonalInfoDto,
    ) {
        return this.resumesService.updatePersonalInfo(
            id,
            user.userId,
            dto,
        );
    }

    @Patch(":id/summary")
    @UseGuards(AuthGuard("jwt"))
    async updateSummary(
        @Param("id") id: string,
        @CurrentUser() user,
        @Body() dto: UpdateSummaryDto,
    ) {
        return this.resumesService.updateSummary(
            id,
            user.userId,
            dto,
        );
    }

    @Post(":id/experiences")
    @UseGuards(AuthGuard("jwt"))
    async addExperience(
        @Param("id") id: string,
        @CurrentUser() user,
        @Body() dto: CreateExperienceDto,
    ) {
        return this.resumesService.addExperience(
            id,
            user.userId,
            dto,
        );
    }

    @Patch(":resumeId/experiences/:experienceId")
    @UseGuards(AuthGuard("jwt"))
    async updateExperience(
        @Param("resumeId") resumeId: string,
        @Param("experienceId") experienceId: string,
        @CurrentUser() user,
        @Body() dto: UpdateExperienceDto,
    ) {
        return this.resumesService.updateExperience(
            resumeId,
            user.userId,
            experienceId,
            dto,
        );
    }

    @Delete(":resumeId/experiences/:experienceId")
    @UseGuards(AuthGuard("jwt"))
    async removeExperience(
        @Param("resumeId") resumeId: string,
        @Param("experienceId") experienceId: string,
        @CurrentUser() user,
    ) {
        return this.resumesService.removeExperience(
            resumeId,
            user.userId,
            experienceId,
        );
    }


    @Post(":id/education")
    @UseGuards(AuthGuard("jwt"))
    async addEducation(
        @Param("id") id: string,
        @CurrentUser() user,
        @Body() dto: CreateEducationDto,
    ) {
        return this.resumesService.addEducation(
            id,
            user.userId,
            dto,
        );
    }

    @Patch(":resumeId/education/:educationId")
    @UseGuards(AuthGuard("jwt"))
    async updateEducation(
        @Param("resumeId") resumeId: string,
        @Param("educationId") educationId: string,
        @CurrentUser() user,
        @Body() dto: UpdateEducationDto,
    ) {
        return this.resumesService.updateEducation(
            resumeId,
            user.userId,
            educationId,
            dto,
        );
    }

    @Delete(":resumeId/education/:educationId")
    @UseGuards(AuthGuard("jwt"))
    async removeEducation(
        @Param("resumeId") resumeId: string,
        @Param("educationId") educationId: string,
        @CurrentUser() user,
    ) {
        return this.resumesService.removeEducation(
            resumeId,
            user.userId,
            educationId,
        );
    }


    @UseGuards(AuthGuard("jwt"))
    @Post(":id/projects")
    async addProject(
        @Param("id") id: string,
        @CurrentUser() user,
        @Body() dto: CreateProjectDto,
    ) {
        return this.resumesService.addProject(
            id,
            user.userId,
            dto,
        );
    }

    @UseGuards(AuthGuard("jwt"))
    @Post(":id/certifications")
    async addCertification(
        @Param("id") id: string,
        @CurrentUser() user,
        @Body() dto: CreateCertificationDto,
    ) {
        return this.resumesService.addCertification(
            id,
            user.userId,
            dto,
        );
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch(":resumeId/certifications/:certificationId")
    async updateCertification(
        @Param("resumeId") resumeId: string,
        @Param("certificationId") certificationId: string,
        @CurrentUser() user,
        @Body() dto: UpdateCertificationDto,
    ) {
        return this.resumesService.updateCertification(
            resumeId,
            user.userId,
            certificationId,
            dto,
        );
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete(":resumeId/certifications/:certificationId")
    async removeCertification(
        @Param("resumeId") resumeId: string,
        @Param("certificationId") certificationId: string,
        @CurrentUser() user,
    ) {
        return this.resumesService.removeCertification(
            resumeId,
            user.userId,
            certificationId,
        );
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch(":resumeId/projects/:projectId")
    async updateProject(
        @Param("resumeId") resumeId: string,
        @Param("projectId") projectId: string,
        @CurrentUser() user,
        @Body() dto: UpdateProjectDto,
    ) {
        return this.resumesService.updateProject(
            resumeId,
            user.userId,
            projectId,
            dto,
        );
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete(":resumeId/projects/:projectId")
    async removeProject(
        @Param("resumeId") resumeId: string,
        @Param("projectId") projectId: string,
        @CurrentUser() user,
    ) {
        return this.resumesService.removeProject(
            resumeId,
            user.userId,
            projectId,
        );
    }

    // ── Language ──

    @UseGuards(AuthGuard("jwt"))
    @Post(":id/languages")
    async addLanguage(
        @Param("id") id: string,
        @CurrentUser() user,
        @Body() dto: CreateLanguageDto,
    ) {
        return this.resumesService.addLanguage(id, user.userId, dto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch(":resumeId/languages/:languageId")
    async updateLanguage(
        @Param("resumeId") resumeId: string,
        @Param("languageId") languageId: string,
        @CurrentUser() user,
        @Body() dto: UpdateLanguageDto,
    ) {
        return this.resumesService.updateLanguage(resumeId, user.userId, languageId, dto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete(":resumeId/languages/:languageId")
    async removeLanguage(
        @Param("resumeId") resumeId: string,
        @Param("languageId") languageId: string,
        @CurrentUser() user,
    ) {
        return this.resumesService.removeLanguage(resumeId, user.userId, languageId);
    }

    // ── Award ──

    @UseGuards(AuthGuard("jwt"))
    @Post(":id/awards")
    async addAward(
        @Param("id") id: string,
        @CurrentUser() user,
        @Body() dto: CreateAwardDto,
    ) {
        return this.resumesService.addAward(id, user.userId, dto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch(":resumeId/awards/:awardId")
    async updateAward(
        @Param("resumeId") resumeId: string,
        @Param("awardId") awardId: string,
        @CurrentUser() user,
        @Body() dto: UpdateAwardDto,
    ) {
        return this.resumesService.updateAward(resumeId, user.userId, awardId, dto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete(":resumeId/awards/:awardId")
    async removeAward(
        @Param("resumeId") resumeId: string,
        @Param("awardId") awardId: string,
        @CurrentUser() user,
    ) {
        return this.resumesService.removeAward(resumeId, user.userId, awardId);
    }

    // ── Reference ──

    @UseGuards(AuthGuard("jwt"))
    @Post(":id/references")
    async addReference(
        @Param("id") id: string,
        @CurrentUser() user,
        @Body() dto: CreateReferenceDto,
    ) {
        return this.resumesService.addReference(id, user.userId, dto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch(":resumeId/references/:referenceId")
    async updateReference(
        @Param("resumeId") resumeId: string,
        @Param("referenceId") referenceId: string,
        @CurrentUser() user,
        @Body() dto: UpdateReferenceDto,
    ) {
        return this.resumesService.updateReference(resumeId, user.userId, referenceId, dto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete(":resumeId/references/:referenceId")
    async removeReference(
        @Param("resumeId") resumeId: string,
        @Param("referenceId") referenceId: string,
        @CurrentUser() user,
    ) {
        return this.resumesService.removeReference(resumeId, user.userId, referenceId);
    }

    // ── Custom Section ──

    @UseGuards(AuthGuard("jwt"))
    @Post(":id/custom-sections")
    async addCustomSection(
        @Param("id") id: string,
        @CurrentUser() user,
        @Body() dto: CreateCustomSectionDto,
    ) {
        return this.resumesService.addCustomSection(id, user.userId, dto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch(":resumeId/custom-sections/:customSectionId")
    async updateCustomSection(
        @Param("resumeId") resumeId: string,
        @Param("customSectionId") customSectionId: string,
        @CurrentUser() user,
        @Body() dto: UpdateCustomSectionDto,
    ) {
        return this.resumesService.updateCustomSection(resumeId, user.userId, customSectionId, dto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete(":resumeId/custom-sections/:customSectionId")
    async removeCustomSection(
        @Param("resumeId") resumeId: string,
        @Param("customSectionId") customSectionId: string,
        @CurrentUser() user,
    ) {
        return this.resumesService.removeCustomSection(resumeId, user.userId, customSectionId);
    }

    // ── Skills ──

    @UseGuards(AuthGuard("jwt"))
    @Patch(":resumeId/skills")
    async updateSkills(
        @Param("resumeId") resumeId: string,
        @CurrentUser() user,
        @Body() dto: UpdateSkillsDto,
    ) {
        return this.resumesService.updateSkills(resumeId, user.userId, dto);
    }
}