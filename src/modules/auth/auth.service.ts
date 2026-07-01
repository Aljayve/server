import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        if (dto.password !== dto.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) throw new ConflictException('Email already in exists');

        const user =
            await this.usersService.create({
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                password: dto.password,
            });

        const accessToken =
            await this.jwtService.signAsync({
                sub: user._id,
                email: user.email,
                role: user.role,
            });

        return {
            message: "Registration successful",
            accessToken,
        };
    }

    async login(dto: LoginDto) {

        const user =
            await this.usersService
                .findByEmailWithPassword(
                    dto.email,
                );

        if (!user) {
            throw new UnauthorizedException(
                "Invalid credentials",
            );
        }

        const isMatch =
            await bcrypt.compare(
                dto.password,
                user.password,
            );

        if (!isMatch) {
            throw new UnauthorizedException(
                "Invalid credentials",
            );
        }

        const accessToken =
            await this.jwtService.signAsync({
                sub: user._id,
                email: user.email,
                role: user.role,
            });

        return {
            message: "Login successful",
            accessToken,
        };
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        const profile = await this.usersService.findById(userId);
        const user = await this.usersService.findByEmailWithPassword(profile.email);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isMatch) {
            throw new BadRequestException("Current password is incorrect");
        }

        const hashed = await bcrypt.hash(dto.newPassword, 10);
        await this.usersService.update(userId, { password: hashed } as any);

        return { message: "Password changed successfully" };
    }

    private sanitize(user: any) {
        const { password, ...rest } = user.toObject ? user.toObject() : user;
        return rest;
    }
}
