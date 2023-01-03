import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
	@IsNotEmpty({ message: i18nValidationMessage('common.NOT_EMPTY') })
	username: string;

	@IsNotEmpty({ message: i18nValidationMessage('common.NOT_EMPTY') })
	password: string;
}
