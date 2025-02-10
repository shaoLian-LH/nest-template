import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';

type PrismaModel = keyof typeof Prisma.ModelName;

@Injectable()
export abstract class BaseRepository<
	ModelType extends PrismaModel,
	T = any,
	WhereInput = Prisma.TypeMap['model'][ModelType]['operations']['findFirst']['args']['where'],
	CreateInput = Prisma.TypeMap['model'][ModelType]['operations']['create']['args']['data'],
	UpdateInput = Prisma.TypeMap['model'][ModelType]['operations']['update']['args']['data'],
	OrderByInput = Prisma.TypeMap['model'][ModelType]['operations']['findFirst']['args']['orderBy'],
	SelectInput = Prisma.TypeMap['model'][ModelType]['operations']['findFirst']['args']['select']
> {
	protected abstract readonly modelName: ModelType;

	constructor(protected readonly prisma: PrismaService) { }

	// #region 基础属性
	protected get model() {
		return this.prisma[this.modelName.toLowerCase()];
	}
	// #endregion

	// #region 查询操作
	async findById(id: string): Promise<T | null> {
		return this.model.findFirst({
			where: {
				id,
				deleted: 0,
			} as WhereInput,
		}) as Promise<T | null>;
	}

	async findOne(where: WhereInput): Promise<T | null> {
		return this.model.findFirst({
			where: {
				...where,
				deleted: 0,
			} as WhereInput,
		}) as Promise<T | null>;
	}

	async findMany(params: {
		skip?: number;
		take?: number;
		where?: WhereInput;
		orderBy?: OrderByInput;
		select?: SelectInput;
	}): Promise<T[]> {
		const { skip, take, where, orderBy, select } = params;
		return this.model.findMany({
			skip,
			take,
			where: {
				...where,
				deleted: 0,
			} as WhereInput,
			orderBy,
			select,
		}) as Promise<T[]>;
	}

	async count(where: WhereInput): Promise<number> {
		return this.model.count({
			where: {
				...where,
				deleted: 0,
			} as WhereInput,
		});
	}

	async exists(where: WhereInput): Promise<boolean> {
		const count = await this.count(where);
		return count > 0;
	}
	// #endregion

	// #region 创建操作
	async create(data: CreateInput): Promise<T> {
		return this.model.create({
			data,
		}) as Promise<T>;
	}

	async createMany(data: CreateInput[]): Promise<Prisma.BatchPayload> {
		return this.model.createMany({
			data,
			skipDuplicates: true,
		});
	}
	// #endregion

	// #region 更新操作
	async update(id: string, data: UpdateInput): Promise<T> {
		return this.model.update({
			where: { id } as WhereInput,
			data,
		}) as Promise<T>;
	}

	async updateMany(where: WhereInput, data: UpdateInput): Promise<Prisma.BatchPayload> {
		return this.model.updateMany({
			where: {
				...where,
				deleted: 0,
			} as WhereInput,
			data,
		});
	}

	async upsert(where: WhereInput, create: CreateInput, update: UpdateInput): Promise<T> {
		return this.model.upsert({
			where,
			create: {
				...create,
				deleted: 0,
			} as CreateInput,
			update,
		}) as Promise<T>;
	}
	// #endregion

	// #region 删除操作
	async softDelete(id: string): Promise<T> {
		return this.model.update({
			where: { id } as WhereInput,
			data: { deleted: 1 } as UpdateInput,
		}) as Promise<T>;
	}

	async softDeleteMany(where: WhereInput): Promise<Prisma.BatchPayload> {
		return this.model.updateMany({
			where: {
				...where,
				deleted: 0,
			} as WhereInput,
			data: { deleted: 1 } as UpdateInput,
		});
	}

	async hardDelete(id: string): Promise<T> {
		return this.model.delete({
			where: { id } as WhereInput,
		}) as Promise<T>;
	}

	async hardDeleteMany(where: WhereInput): Promise<Prisma.BatchPayload> {
		return this.model.deleteMany({
			where,
		});
	}
	// #endregion

	// #region 事务操作
	async executeTransaction<P>(
		fn: (prisma: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => Promise<P>,
	): Promise<P> {
		return this.prisma.$transaction(fn as any) as Promise<P>;
	}
	// #endregion

	// #region 高级查询
	async findOneOrCreate(where: WhereInput, create: CreateInput): Promise<T> {
		const found = await this.findOne(where);
		if (found) return found;
		return this.create(create);
	}

	async findOneOrFail(where: WhereInput): Promise<T> {
		const found = await this.findOne(where);
		if (!found) {
			throw new Error(`Entity not found`);
		}
		return found;
	}

	async paginate(params: {
		page?: number;
		limit?: number;
		where?: WhereInput;
		orderBy?: OrderByInput;
		select?: SelectInput;
	}): Promise<{
		list: T[];
		current: number;
		prev: number | null;
		next: number | null;
		hasPrev: boolean;
		hasNext: boolean;
		total: number;
	}> {
		const { page = 1, limit = 10, ...rest } = params;
		const skip = (page - 1) * limit;

		const [list, total] = await Promise.all([
			this.findMany({ ...rest, skip, take: limit }),
			this.count(rest.where || {} as WhereInput),
		]);

		const listIsEmpty = list.length === 0;
		const prev = !listIsEmpty ? page - 1 || null : null;
		const next = !listIsEmpty ? Math.floor(total / limit) + 1 : null;

		return {
			list,
			current: page,
			prev,
			next,
			hasPrev: prev !== null && !listIsEmpty,
			hasNext: next !== page && !listIsEmpty,
			total,
		};
	}
	// #endregion
}