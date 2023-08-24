import { UseGuards, applyDecorators } from "@nestjs/common";
import { Role } from "./";
import { RoleGuard } from "src/guards";
import { TPrivateRoutes } from "src/typings/PrivateRoutes.typing";

export const PrivateRole = (role: TPrivateRoutes) => {
	return applyDecorators(
		Role(role),
		UseGuards(RoleGuard)
	);
};