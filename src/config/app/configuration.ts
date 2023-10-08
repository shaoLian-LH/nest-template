export interface MysqlDatabaseConfiguration {
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
	synchronize: boolean;
	dropSchema: boolean;
	debug: boolean;
}

export interface JwtConfiguration {
	secret: string;
	signOptions: {
		expiresIn: string;
	};
}

export interface AppConfiguration {
	protocol: 'http' | 'https';
	ip: string;
	port: number;
}

export interface Configuration {
	APP: AppConfiguration;
	jwt: JwtConfiguration;
}

export const configForTest = (): Configuration => ({
	APP: {
		protocol: 'http',
		ip: 'localhost',
		port: 3000,
	},
	jwt: {
		secret: 'topSecret',
		signOptions: {
			expiresIn: '7d',
		},
	},
});

export const configForDevelopment = (): Configuration => ({
	APP: {
		protocol: 'http',
		ip: 'localhost',
		port: 3000,
	},
	jwt: {
		secret: 'topSecret',
		signOptions: {
			expiresIn: '7d',
		},
	},
});

export const configForProduction = (): Configuration => ({
	APP: {
		protocol: 'http',
		ip: '0.0.0.0',
		port: 3000,
	},
	jwt: {
		secret: 'topSecret',
		signOptions: {
			expiresIn: '7d',
		},
	},
});

export const loadConfig = () => {
	switch (process.env.NODE_ENV) {
		case 'production':
			return [configForProduction];
		case 'test':
		case 'e2e':
			return [configForTest];
		default:
			return [configForDevelopment];
	}
};
