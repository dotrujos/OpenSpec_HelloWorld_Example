import express, { Application } from "express";
import routes from "./routes";
import { notFoundHandler } from "./middlewares/not-found";
import { errorHandler } from "./middlewares/error-handler";

const app: Application = express();

app.use(express.json());
app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
