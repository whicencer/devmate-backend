import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	const authToken = request.headers.authorization.split(' ')[1];
	const jwt = new JwtService();

	try {
		const decodedToken = jwt.decode(authToken);
		const user: User = decodedToken as User;

		if (data) {
			return user[data];
		}

		return user;
	} catch (error) {
		throw new Error('Cannot decode a token');
	}
});