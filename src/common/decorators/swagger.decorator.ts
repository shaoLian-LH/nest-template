import { ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { applyDecorators, Type } from "@nestjs/common";
import { BaseResponse } from "../swagger/enhance";

export const ApiCommonResponse = <TModel extends Type<any>>(model: TModel) => {
	return applyDecorators(
		ApiOkResponse({
			schema: {
				allOf: [
					{ $ref: getSchemaPath(BaseResponse) },
					{
						properties: {
							data: {
								$ref: getSchemaPath(model),
							},
						},
					},
				],
			},
		}),
	)
}