import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { SignupDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {};

	async signup(dto: SignupDto) {
		// generate password hash
		const hash = await argon.hash(dto.password);

		// create user in database
		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				fullname: dto.fullname,
				hash,
				username: dto.username
			}
		});

		delete user.hash;

		// return created user
		return user;
	}

	signin() {
		return { msg: 'signin' };
	}
}
