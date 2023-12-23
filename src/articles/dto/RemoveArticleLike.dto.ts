import { IsOptional } from "class-validator";

export class RemoveArticleLike {
	@IsOptional()
  likeId: number;
}