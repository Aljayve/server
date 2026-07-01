import { Controller, Get, Param, Query } from "@nestjs/common";
import { TemplatesService } from "./templates.service";

@Controller("templates")
export class TemplatesController {
    constructor(
        private readonly templatesService: TemplatesService,
    ) { }

    @Get()
    findAll(
        @Query("plan") plan?: string,
    ) {
        return this.templatesService.findAll(plan);
    }

    @Get(":slug")
    findOne(
        @Param("slug")
        slug: string,
    ) {
        return this.templatesService.findBySlug(
            slug,
        );
    }
}