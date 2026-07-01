import { Controller, Get, Patch, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly service: NotificationsService) { }

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.service.findAll(user.userId);
    }

    @Get("unread/count")
    countUnread(@CurrentUser() user: any) {
        return this.service.countUnread(user.userId);
    }

    @Patch(":id/read")
    markAsRead(@Param("id") id: string, @CurrentUser() user: any) {
        return this.service.markAsRead(id, user.userId);
    }

    @Patch("read-all")
    markAllAsRead(@CurrentUser() user: any) {
        return this.service.markAllAsRead(user.userId);
    }
}
