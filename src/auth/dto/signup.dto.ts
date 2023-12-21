import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class SignupDto {
	@IsNotEmpty()
	@MaxLength(22)
	fullname: string;

	@IsNotEmpty()
	@MaxLength(16)
	username: string;

	@IsNotEmpty()
	@MinLength(8)
	password: string;

	profilePicture: string;
}