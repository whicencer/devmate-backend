import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
	@IsNotEmpty()
	fullname: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@MinLength(2)
	username: string;

	@IsNotEmpty()
	@MinLength(8)
	password: string;
}