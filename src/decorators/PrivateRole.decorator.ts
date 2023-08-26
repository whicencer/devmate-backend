import { UseGuards, applyDecorators } from "@nestjs/common";
import { Role } from "./";
import { RoleGuard } from "../guards";
import { TPrivateRoutes } from "../typings/PrivateRoutes.typing";

export const PrivateRole = (role: TPrivateRoutes) => {
	return applyDecorators(
		Role(role),
		UseGuards(RoleGuard)
	);
};