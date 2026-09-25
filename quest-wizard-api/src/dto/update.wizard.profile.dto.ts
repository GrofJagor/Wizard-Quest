import { IsInt, IsOptional, IsString, IsUrl, Max, Min } from "class-validator";
 
export class UpdateWizardProfileDto {
  @IsOptional()
  @IsString()
  name?: string;
 
  @IsOptional()
  @IsString()
  affinity?: string;
 
  @IsOptional()
  @IsUrl()
  pictureUrl?: string;
 
  @IsOptional()
  @IsInt()
  @Min(1)
  level?: number;
 
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  xp?: number;
}
 