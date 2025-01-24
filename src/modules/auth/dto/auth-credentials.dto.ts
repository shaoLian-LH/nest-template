import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AuthCredentialsDto {
	@IsString({
		message: i18nValidationMessage('common.TYPE_STRING', {
			property: 'name',
		}),
	})
	@MinLength(5, {
		message: i18nValidationMessage('common.MIN', { property: 'name' })
	})
	@MaxLength(20, {
		message: i18nValidationMessage('common.MAX', { property: 'name' })
	})
	name: string;

	@IsString({
		message: i18nValidationMessage('common.TYPE_STRING', {
			property: 'password',
		}),
	})
	@MinLength(8, {
		message: i18nValidationMessage('common.MIN', { property: 'password' })
	})
	@MaxLength(32, {
		message: i18nValidationMessage('common.MAX', { property: 'password' })
	})
	@Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, {
		message: i18nValidationMessage('common.AUTH_SIGN_UP'),
	})
	password: string;
}
