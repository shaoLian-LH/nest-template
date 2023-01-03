import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('slfk_cake')
export class Cake extends BaseEntity {
	@PrimaryGeneratedColumn({ comment: '蛋糕ID' })
	id: string;

	@Column({ comment: '蛋糕品牌', nullable: false })
	@PrimaryColumn()
	brand: string;

	@Column({ comment: '蛋糕名称', nullable: false })
	name: string;
}
