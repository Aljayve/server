import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { Resume } from '../resumes/schemas/resume.schema';
import { CoverLetter } from '../cover-letters/schemas/cover-letter.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { getPlanLimits, type PlanLimits } from '../../common/config/plan.config';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Resume.name) private readonly resumeModel: Model<any>,
        @InjectModel(CoverLetter.name) private readonly coverLetterModel: Model<any>,
    ) { }

    async getResetDate(userId: string): Promise<Date> {
        const user = await this.ensureReset(userId);
        if (!user.usageResetAt) return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return new Date(user.usageResetAt.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    private async ensureReset(userId: string): Promise<UserDocument> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) throw new NotFoundException('User not found');

        if (!user.usageResetAt) {
            user.usageResetAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await user.save();
        } else if (new Date() >= user.usageResetAt) {
            user.usageResetAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await user.save();
        }

        return user;
    }

    async getUsage(userId: string) {
        const user = await this.ensureReset(userId);

        const since = user.usageResetAt
            ? new Date(user.usageResetAt.getTime() - 30 * 24 * 60 * 60 * 1000)
            : new Date(0);

        const [resumes, coverLetters] = await Promise.all([
            this.resumeModel.countDocuments({ userId, createdAt: { $gte: since } }),
            this.coverLetterModel.countDocuments({ userId, createdAt: { $gte: since } }),
        ]);

        return {
            plan: user.plan,
            limits: getPlanLimits(user.plan),
            usage: { resumes, coverLetters },
            usageResetAt: user.usageResetAt,
        };
    }

    async checkPlanLimit(
        userId: string,
        resource: keyof PlanLimits,
        currentCount: number,
    ) {
        const user = await this.ensureReset(userId);

        const limits = getPlanLimits(user.plan);
        const limit = limits[resource] as number;
        const limitReached = currentCount >= limit;

        if (limitReached) {
            const label = resource.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
            throw new ForbiddenException(
                `You've reached the ${label} limit (${limit}) for the ${user.plan} plan. Upgrade to create more.`,
            );
        }
    }

    async create(dto: CreateUserDto) {
        const existing = await this.userModel.findOne({ email: dto.email }).exec();
        if (existing) throw new ConflictException('Email already in use');

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.userModel.create({ ...dto, password: hashed });
        return this.sanitize(user);
    }

    async findAll() {
        const users = await this.userModel.find().exec();
        return users.map((u) => this.sanitize(u));
    }

    async findById(id: string) {
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('User not found');
        return this.sanitize(user);
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email }).exec();
    }

    async findByEmailWithPassword(email: string) {
        return this.userModel
            .findOne({ email })
            .select("+password");
    }

    async update(id: string, dto: UpdateUserDto) {
        const user = await this.userModel.findByIdAndUpdate(id, dto, { returnDocument: 'after' }).exec();
        if (!user) throw new NotFoundException('User not found');
        return this.sanitize(user);
    }

    async updateProfile(
        userId: string,
        dto: UpdateProfileDto,
    ) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            dto,
            {
                returnDocument: 'after',
            },
        ).exec();

        if (!user) throw new NotFoundException('User not found');

        return this.sanitize(user);
    }

    async getProfile(userId: string) {
        const user = await this.userModel.findById(userId).exec();

        if (!user) throw new NotFoundException('User not found');

        return this.sanitize(user);
    }

    async updateAvatar(userId: string, avatar: { url: string; publicId: string }) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { avatar },
            { returnDocument: 'after' },
        ).exec();

        if (!user) throw new NotFoundException('User not found');

        return this.sanitize(user);
    }

    async remove(id: string) {
        const user = await this.userModel.findByIdAndDelete(id).exec();
        if (!user) throw new NotFoundException('User not found');
        return { message: 'User deleted successfully' };
    }

    private sanitize(user: UserDocument) {
        const obj = user.toObject();
        const { password, ...rest } = obj;
        return rest;
    }
}
