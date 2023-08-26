import { UseGuards, applyDecorators } from "@nestjs/common";
import { JwtGuard } from "../auth/guard";

export const Authorize = () => applyDecorators(UseGuards(JwtGuard));