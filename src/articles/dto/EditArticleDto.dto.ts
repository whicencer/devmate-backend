import { IsNotEmpty } from "class-validator";

export class EditArticleDto {
	@IsNotEmpty()
	content: string;
  media?: string;
}