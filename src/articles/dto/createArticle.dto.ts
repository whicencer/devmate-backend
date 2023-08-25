import { IsNotEmpty } from "class-validator";

export class CreateArticleDto {
	@IsNotEmpty()
	content: string;
  media?: string;
}