import { BaseResponse } from '@/common/swagger/enhance';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@/entities/User.entity';

export class UserCommonResponse extends BaseResponse {
	@ApiProperty({
		type: () => UserEntity,
	})
	data: UserEntity
}