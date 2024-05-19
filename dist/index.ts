import e from "express";
import error from "../middleware/error";
import connectDB from "../startup/database";
import config from "../startup/config";
import prod from "../startup/prod";
import logger from "../startup/logging";
import { router } from "../startup/routes";


const app = e();

// 启动
connectDB();
config();
// 添加中间件
app.use(e.json());
// 路由转接
router(app);
// 捕捉错误
app.use(error);
// 生产环境
prod(app);

// 监听
const port = process.env.PORT_ENV || 3000;
export const server = app.listen(port, () => logger.info(`Listening ${port}`));
