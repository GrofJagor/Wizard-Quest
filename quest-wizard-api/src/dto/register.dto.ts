import { IsEmail, IsEnum, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";
import { UserRole } from "../entities/user.entity.js";


export class RegisterDto {
  @IsEmail()
  email: string;
 
  @IsString()
  @MinLength(8)
  password: string;
 
  @IsEnum(UserRole)
  role: UserRole;
 
  @IsString()
  name: string;
 
  @ValidateIf((dto) => dto.role === UserRole.WIZARD)
  @IsString()
  affinity?: string;
}
 
 