export interface MysqlDatabaseConfiguration {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
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
  DB_CONFIG: MysqlDatabaseConfiguration;
  jwt: JwtConfiguration;
}

export const configForDevelopment = (): Configuration => ({
  APP: {
    protocol: 'http',
    ip: 'localhost',
    port: 3000,
  },
  DB_CONFIG: {
    host: '127.0.0.1',
    port: 3307,
    username: 'root',
    password: '123456',
    database: 'subject',
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
  DB_CONFIG: {
    host: '127.0.0.1',
    port: 3307,
    username: 'root',
    password: '123456',
    database: 'subject',
  },
  jwt: {
    secret: 'topSecret',
    signOptions: {
      expiresIn: '7d',
    },
  },
});
