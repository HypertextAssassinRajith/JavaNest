import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import productsRouter from "./src/routes/products.routes.js";
import ordersRouter from "./src/routes/orders.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));