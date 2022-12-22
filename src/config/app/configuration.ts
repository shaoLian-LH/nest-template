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

export interface Configuration {
  DB_CONFIG: MysqlDatabaseConfiguration;
  jwt: JwtConfiguration;
}

export const loaderForDevelopment = (): Configuration => ({
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
