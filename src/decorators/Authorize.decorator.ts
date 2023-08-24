import { UseGuards, applyDecorators } from "@nestjs/common";
import { JwtGuard } from "src/auth/guard";

export const Authorize = () => applyDecorators(UseGuards(JwtGuard));