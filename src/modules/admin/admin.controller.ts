import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { AdminService } from "./admin.service";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get("dashboard")
    @Roles("admin")
    getDashboard() {
        return this.adminService.getDashboard();
    }

    @Get("users")
    @Roles("admin")
    getUsers() {
        return this.adminService.getUsers();
    }

    @Get("resumes")
    @Roles("admin")
    getResumes() {
        return this.adminService.getResumes();
    }

    @Get("templates")
    @Roles("admin")
    getTemplates() {
        return this.adminService.getTemplates();
    }

    @Get("analytics")
    @Roles("admin")
    getAnalytics() {
        return this.adminService.getAnalytics();
    }

    @Get("settings")
    @Roles("admin")
    getSettings() {
        return this.adminService.getAppSettings();
    }

    @Patch("settings")
    @Roles("admin")
    updateSettings(@Body() dto: Record<string, any>) {
        return this.adminService.updateAppSettings(dto);
    }
}
