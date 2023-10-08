import { Module, DynamicModule, Global, OnModuleDestroy } from '@nestjs/common';
import { NacosNamingClient, ClientOptions, NacosConfigClient } from 'nacos';
import { join } from 'path';

export interface NacosModuleOptions {
	namingClientOptions?: {
		serverList: string[];
		serviceName: string;
		ip: string;
		port: number;
	},
	configClientOptions: ClientOptions
	namespace?: string;
  group?: string;
  accessKey?: string;
  secretKey?: string;
  username?: string;
  password?: string;
	requestTimeout?: number;
}


class NacosInstanceRecorder {
	static nacosNamingClient: NacosNamingClient;
	static nacosOptions: NacosModuleOptions;
	static nacosConfigClient: NacosConfigClient;

	static initialize(options: NacosModuleOptions) {
		if (options.namingClientOptions) {
			const { serverList } = options.namingClientOptions
			NacosInstanceRecorder.nacosNamingClient = new NacosNamingClient({
				logger: console,
				serverList: serverList,
				namespace: options.namespace,
				// @ts-ignore
				username: options.username,
				// @ts-ignore
				password: options.password,
			});
		}

		NacosInstanceRecorder.nacosOptions = options

		NacosInstanceRecorder.nacosConfigClient = new NacosConfigClient({
			serverAddr: options.configClientOptions.serverAddr,
			namespace: options.namespace,
			defaultEncoding: 'UTF-8',
			cacheDir: options.configClientOptions.cacheDir || join(__dirname, './nacos-cahce'),
			// @ts-ignore
			username: options.username,
			// @ts-ignore
			password: options.password,
		});
	}
}

@Global()
@Module({})
export class NacosModule implements OnModuleDestroy {
	static async forRoot(
		options: NacosModuleOptions
	): Promise<DynamicModule> {
		NacosInstanceRecorder.initialize(options)

		const providers: any[] = []

		providers.push({
			provide: NacosConfigClient,
			useValue: NacosInstanceRecorder.nacosConfigClient,
		})

		if (options.namingClientOptions) {
			const namingClient = NacosInstanceRecorder.nacosNamingClient
			await namingClient.ready()

			const { serviceName, ip, port } = options.namingClientOptions
			await namingClient.registerInstance(serviceName, {
				ip: ip,
				port: port,
				// @ts-ignore
				username: options.username,
				// @ts-ignore
				password: options.password,
			})

			providers.push({
				provide: NacosNamingClient,
				useValue: namingClient,
			})
		}

		return {
			module: NacosModule,
			providers: providers,
			exports: providers,
		};
	}

	onModuleDestroy() {
		if (NacosInstanceRecorder.nacosNamingClient) {
			const { username, password } = NacosInstanceRecorder.nacosOptions;
			const { serviceName, ip, port } = NacosInstanceRecorder.nacosOptions.namingClientOptions
			NacosInstanceRecorder.nacosNamingClient.deregisterInstance(serviceName, {
				ip: ip,
				port: port,
				// @ts-ignore
				username: username,
				// @ts-ignore
				password: password,
			})
		}
	}
}
