import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { SignupDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {};

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
			
			// delete hash from final result
			delete user.hash;

			// return created user
			return user;
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

	signin() {
		return { msg: 'signin' };
	}
}
