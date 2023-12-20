import { ConnectionOptions } from "typeorm";



const config: ConnectionOptions = {
  type: "postgres",
  host: process.env.DATABASE_HOSTNAME,
  port: Number(process.env.DATABASE_PORT),
  username: 'postgres', // process.env.DATABASE_USERNAME,
  password: 'pass123', // process.env.DATABASE_PASSWORD,
  database: 'amsa', // process.env.DATABASE_NAME,
  entities: [`${__dirname  }/entity/**/*{.ts,.js}`],
  migrations: [
   
  ],
  synchronize: true,
  extra: {
    ssl: process.env.NODE_ENV === "production",
    rejectUnauthorized: true,

    // based on  https://node-postgres.com/api/pool
    // max connection pool size
    max: 12,
    keepAlive: true,
    // idleTimeoutMillis: 600000,

    // connection timeout
    connectionTimeoutMillis: 25000,
  },
  poolErrorHandler: (err: any) => {
    console.log("Database pool error: ", err.message);
    console.log("Database pool error details: ", JSON.stringify(err, null, 4));
  },
  // logging: process.env.NODE_ENV !== 'production'
};

console.log("Db connection was successfull");

export default config;
