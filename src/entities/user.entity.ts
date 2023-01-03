import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('slfk_user')
export class User {
	@PrimaryGeneratedColumn('uuid', { comment: '用户ID' })
	id: string;

	@Column({ comment: '用户名称', nullable: false, unique: true })
	username: string;

	@Column({ comment: '用户密码', nullable: false })
	password: string;

	@Column({ comment: '用户是否禁用', nullable: false, default: 0 })
	blocked: number;

	@Column({
		comment: '逻辑删除，0代表未删除，1代表删除',
		nullable: false,
		default: 0,
	})
	deleted: number;

	@CreateDateColumn({ comment: '用户创建时间', nullable: false })
	created_time: Date;
}
