export interface IMysqlDatabaseConfiguration {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface IJwtConfiguration {
  secret: string;
  signOptions: {
    expiresIn: string;
  };
}

export interface IConfiguration {
  mysql: IMysqlDatabaseConfiguration;
  jwt: IJwtConfiguration;
}

export const loaderForDevelopment = (): IConfiguration => ({
  mysql: {
    host: 'localhost',
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
