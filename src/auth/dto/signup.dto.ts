import { IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
	@IsNotEmpty()
	fullname: string;

	@IsNotEmpty()
	@MinLength(2)
	username: string;

	@IsNotEmpty()
	@MinLength(8)
	password: string;
}