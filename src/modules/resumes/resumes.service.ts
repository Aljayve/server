import { Injectable } from "@nestjs/common";

import {
    ResumeCrudService,
    PersonalInfoService,
    SummaryService,
    ArraySectionService,
} from "./services";

import { CreateResumeDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { UpdatePersonalInfoDto } from "./dto/sections/update-personal-info.dto";
import { UpdateSummaryDto } from "./dto/sections/update-summary.dto";
import { CreateExperienceDto } from "./dto/experience/create-experience.dto";
import { UpdateExperienceDto } from "./dto/experience/update-experience.dto";
import { CreateEducationDto } from "./dto/education/create-education.dto";
import { UpdateEducationDto } from "./dto/education/update-education.dto";
import { CreateProjectDto } from "./dto/project/create-project.dto";
import { UpdateProjectDto } from "./dto/project/update-project.dto";
import { CreateCertificationDto } from "./dto/certification/create-certification.dto";
import { UpdateCertificationDto } from "./dto/certification/update-certification.dto";
import { CreateLanguageDto } from "./dto/language/create-language.dto";
import { UpdateLanguageDto } from "./dto/language/update-language.dto";
import { CreateAwardDto } from "./dto/award/create-award.dto";
import { UpdateAwardDto } from "./dto/award/update-award.dto";
import { CreateReferenceDto } from "./dto/reference/create-reference.dto";
import { UpdateReferenceDto } from "./dto/reference/update-reference.dto";
import { CreateCustomSectionDto } from "./dto/custom-section/create-custom-section.dto";
import { UpdateCustomSectionDto } from "./dto/custom-section/update-custom-section.dto";
import { UpdateSkillsDto } from "./dto/sections/update-skills.dto";

@Injectable()
export class ResumesService {
    constructor(
        private readonly crud: ResumeCrudService,
        private readonly personalInfo: PersonalInfoService,
        private readonly summary: SummaryService,
        private readonly arraySection: ArraySectionService,
    ) { }

    // ── CRUD ──
    async create(userId: string, dto: CreateResumeDto) {
        return this.crud.create(userId, dto);
    }

    async findAll(userId: string) {
        return this.crud.findAll(userId);
    }

    async findOne(id: string, userId: string) {
        return this.crud.findOne(id, userId);
    }

    async findById(id: string) {
        return this.crud.findById(id);
    }

    async update(id: string, userId: string, dto: UpdateResumeDto) {
        return this.crud.update(id, userId, dto);
    }

    async updatePhoto(id: string, userId: string, photoUrl: string) {
        return this.crud.updatePhoto(id, userId, photoUrl);
    }

    async remove(id: string, userId: string) {
        return this.crud.remove(id, userId);
    }

    // ── ATS Score ──
    async updateAtsScore(id: string, score: number) {
        return this.crud.updateAtsScore(id, score);
    }

    // ── Personal Info ──
    async updatePersonalInfo(id: string, userId: string, dto: UpdatePersonalInfoDto) {
        return this.personalInfo.update(id, userId, dto);
    }

    // ── Summary ──
    async updateSummary(id: string, userId: string, dto: UpdateSummaryDto) {
        return this.summary.update(id, userId, dto);
    }

    // ── Skills ──
    async updateSkills(resumeId: string, userId: string, dto: UpdateSkillsDto) {
        return this.crud.updateSkills(resumeId, userId, dto);
    }

    // ── Experience ──
    async addExperience(resumeId: string, userId: string, dto: CreateExperienceDto) {
        return this.arraySection.addItem(resumeId, userId, "experiences", dto);
    }

    async updateExperience(resumeId: string, userId: string, experienceId: string, dto: UpdateExperienceDto) {
        return this.arraySection.updateItem(resumeId, userId, "experiences", experienceId, dto);
    }

    async removeExperience(resumeId: string, userId: string, experienceId: string) {
        return this.arraySection.removeItem(resumeId, userId, "experiences", experienceId);
    }

    // ── Education ──
    async addEducation(resumeId: string, userId: string, dto: CreateEducationDto) {
        return this.arraySection.addItem(resumeId, userId, "education", dto);
    }

    async updateEducation(resumeId: string, userId: string, educationId: string, dto: UpdateEducationDto) {
        return this.arraySection.updateItem(resumeId, userId, "education", educationId, dto);
    }

    async removeEducation(resumeId: string, userId: string, educationId: string) {
        return this.arraySection.removeItem(resumeId, userId, "education", educationId);
    }

    // ── Project ──
    async addProject(resumeId: string, userId: string, dto: CreateProjectDto) {
        return this.arraySection.addItem(resumeId, userId, "projects", dto);
    }

    async updateProject(resumeId: string, userId: string, projectId: string, dto: UpdateProjectDto) {
        return this.arraySection.updateItem(resumeId, userId, "projects", projectId, dto);
    }

    async removeProject(resumeId: string, userId: string, projectId: string) {
        return this.arraySection.removeItem(resumeId, userId, "projects", projectId);
    }

    // ── Certification ──
    async addCertification(resumeId: string, userId: string, dto: CreateCertificationDto) {
        return this.arraySection.addItem(resumeId, userId, "certifications", dto);
    }

    async updateCertification(resumeId: string, userId: string, certificationId: string, dto: UpdateCertificationDto) {
        return this.arraySection.updateItem(resumeId, userId, "certifications", certificationId, dto);
    }

    async removeCertification(resumeId: string, userId: string, certificationId: string) {
        return this.arraySection.removeItem(resumeId, userId, "certifications", certificationId);
    }

    // ── Language ──
    async addLanguage(resumeId: string, userId: string, dto: CreateLanguageDto) {
        return this.arraySection.addItem(resumeId, userId, "languages", dto);
    }

    async updateLanguage(resumeId: string, userId: string, languageId: string, dto: UpdateLanguageDto) {
        return this.arraySection.updateItem(resumeId, userId, "languages", languageId, dto);
    }

    async removeLanguage(resumeId: string, userId: string, languageId: string) {
        return this.arraySection.removeItem(resumeId, userId, "languages", languageId);
    }

    // ── Award ──
    async addAward(resumeId: string, userId: string, dto: CreateAwardDto) {
        return this.arraySection.addItem(resumeId, userId, "awards", dto);
    }

    async updateAward(resumeId: string, userId: string, awardId: string, dto: UpdateAwardDto) {
        return this.arraySection.updateItem(resumeId, userId, "awards", awardId, dto);
    }

    async removeAward(resumeId: string, userId: string, awardId: string) {
        return this.arraySection.removeItem(resumeId, userId, "awards", awardId);
    }

    // ── Reference ──
    async addReference(resumeId: string, userId: string, dto: CreateReferenceDto) {
        return this.arraySection.addItem(resumeId, userId, "references", dto);
    }

    async updateReference(resumeId: string, userId: string, referenceId: string, dto: UpdateReferenceDto) {
        return this.arraySection.updateItem(resumeId, userId, "references", referenceId, dto);
    }

    async removeReference(resumeId: string, userId: string, referenceId: string) {
        return this.arraySection.removeItem(resumeId, userId, "references", referenceId);
    }

    // ── Custom Section ──
    async addCustomSection(resumeId: string, userId: string, dto: CreateCustomSectionDto) {
        return this.arraySection.addItem(resumeId, userId, "customSections", dto);
    }

    async updateCustomSection(resumeId: string, userId: string, customSectionId: string, dto: UpdateCustomSectionDto) {
        return this.arraySection.updateItem(resumeId, userId, "customSections", customSectionId, dto);
    }

    async removeCustomSection(resumeId: string, userId: string, customSectionId: string) {
        return this.arraySection.removeItem(resumeId, userId, "customSections", customSectionId);
    }
}
