import { IsString, MinLength, IsOptional, MaxLength } from "class-validator";

export class CreateArticleDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description: string;

  @IsString()
  body: string;
}
