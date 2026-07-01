import { PartialType } from "@nestjs/mapped-types";
import { CreateCustomSectionDto } from "./create-custom-section.dto";

export class UpdateCustomSectionDto extends PartialType(CreateCustomSectionDto) { }
