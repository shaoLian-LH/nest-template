import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('slfk_user')
export class User {
  @PrimaryGeneratedColumn({ comment: '用户ID' })
  id: string;

  @Column({ comment: '用户名称', nullable: false })
  @PrimaryColumn()
  username: string;

  @Column({ comment: '用户密码', nullable: false })
  password: string;

  @Column({ comment: '加密盐值', nullable: false })
  salt: string;
}
