import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AuthCredentialsDto {
	@IsString({
		message: i18nValidationMessage('common.TYPE_STRING', {
			property: 'username',
		}),
	})
	@MinLength(5)
	@MaxLength(20)
	username: string;

	@IsString({
		message: i18nValidationMessage('common.TYPE_STRING', {
			property: 'password',
		}),
	})
	@MinLength(8)
	@MaxLength(32)
	@Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, {
		message: i18nValidationMessage('common.AUTH_SIGN_UP'),
	})
	password: string;
}
