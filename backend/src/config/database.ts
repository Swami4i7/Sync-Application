import { PoolAttributes } from "oracledb";

const hrPool: PoolAttributes = {
  events: true,
 // _enableStats: true,
  enableStatistics: true,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString:
    process.env.DB_CONNECTION_STRING ,
  poolMin: process.env.DB_POOL_MIN ? parseInt(process.env.DB_POOL_MIN, 10) : 1,
  poolMax: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX, 10) : 2,
  poolIncrement: process.env.DB_POOL_INC
    ? parseInt(process.env.DB_POOL_INC, 10)
    : 1,
  poolTimeout: 60 * 3,
  queueTimeout: 0,
  queueMax: -1
};

export default hrPool;
