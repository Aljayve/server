import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Notification, NotificationDocument } from "./schemas/notification.schema";

@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name)
        private readonly model: Model<NotificationDocument>,
    ) { }

    async findAll(userId: string) {
        return this.model
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();
    }

    async create(dto: { userId: string; title: string; message: string; type?: "info" | "success" | "warning" | "error" }) {
        return this.model.create(dto);
    }

    async markAsRead(id: string, userId: string) {
        return this.model.findOneAndUpdate(
            { _id: id, userId },
            { read: true },
            { returnDocument: "after" },
        );
    }

    async markAllAsRead(userId: string) {
        await this.model.updateMany({ userId, read: false }, { read: true });
        return { message: "All notifications marked as read" };
    }

    async countUnread(userId: string) {
        return this.model.countDocuments({ userId, read: false });
    }
}
