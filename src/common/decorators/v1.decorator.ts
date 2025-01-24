import { Controller, ControllerOptions } from '@nestjs/common';
import _ from 'lodash';

export const V1Controller = (setting: string | ControllerOptions) => {
	if (typeof setting === 'string') {
		return Controller(`/api/v1/${setting}`);
	}
	const originData = _.cloneDeep(setting);
	if (typeof originData.path === 'string') {
		originData.path = `/api/v1/${originData.path.replace(/^\//g, '')}`;
	} else {
		originData.path = originData.path.map(
			(originPath) => `/api/v1/${originPath.replace(/^\//g, '')}`,
		);
	}

	return Controller(originData);
};
