import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @Column({ comment: '数据创建者id', nullable: false })
  created_user_id: string;

  @CreateDateColumn({ comment: '数据创建时间' })
  created_time: Date;

  @Column({ comment: '最近更新数据的用户的id', nullable: false })
  updated_user_id: Date;

  @UpdateDateColumn({ comment: '数据最近更新时间' })
  updated_time: Date;

  @Column({
    comment: '逻辑删除，0表示未删除，1表示删除',
    nullable: false,
    default: 0,
  })
  deleted: number;
}
