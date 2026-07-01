import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateSkillsDto {
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    skills?: string[];
}
