import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

import { SignupDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {};

	async signup(dto: SignupDto) {
		// generate password hash
		const hash = await argon.hash(dto.password);

		try {
			// create user in database
			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					fullname: dto.fullname,
					hash,
					username: dto.username
				}
			});
			
			// return accessToken (JWT)
			return this.signToken(user.id, user.username, user.role);
		} catch (error) {
			// if error is instance of PrismaClient Request error
			if (error instanceof PrismaClientKnownRequestError) {
				// if error code is equals to code which tells about duplicate
				if (error.code === 'P2002') {
					// throw exception
					throw new ForbiddenException('Credentials taken');
				}
			}
			
			throw error;
		}
	}

	async signin(dto: SigninDto) {
		// find user by username
		const user = await this.prisma.user.findUnique({
			where: {
				username: dto.username
			}
		});
		// if user not exist - throw an exception
		if (!user) throw new ForbiddenException('Credentials not correct');

		// compare password
		const passwordMatches = await argon.verify(user.hash, dto.password);
		// if password incorrect - throw an exception
		if (!passwordMatches) throw new ForbiddenException('Credentials not correct'); 

		// return accessToken (JWT)
		return this.signToken(user.id, user.username, user.role);
	}

	async signToken(userId: number, username: string, role: string): Promise<{ accessToken: string }> {
		const payload = {
			id: userId,
			username,
			role
		};
		const secret = this.config.get('JWT_SECRET');

		// generate token
		const token = await this.jwt.signAsync(payload, {
			expiresIn: '24h',
			secret
		});

		// return token
		return { accessToken: token };
	}
}
