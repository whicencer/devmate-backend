import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { TPrivateRoutes } from "src/typings/PrivateRoutes.typing";

export const ROLE_KEY_STRING = 'role';

export const Role = (role: TPrivateRoutes): CustomDecorator<string> => {
	return SetMetadata(ROLE_KEY_STRING, role);
};