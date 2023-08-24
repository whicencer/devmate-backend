import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { Observable } from "rxjs";

import { ROLE_KEY_STRING } from "src/decorators/role.decorator";

export class RoleGuard implements CanActivate {
	constructor(@Inject(JwtService) private readonly jwt: JwtService, readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const requiredRole = this.reflector.get(ROLE_KEY_STRING, context.getHandler());

		const request = context.switchToHttp().getRequest();
		const authToken = request.headers.authorization.split(' ')[1];
		
		const user: User = this.jwt.decode(authToken) as User;

		if (user.role === requiredRole) {
			return true;
		} else {
			throw new UnauthorizedException('Insufficient privileges.');
		}
	}
}