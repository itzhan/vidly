import compression from "compression";
import { Application } from "express";
import helmet from "helmet";

function prod(app: Application) {
  app.use(helmet());
  app.use(compression());
}

export default prod
