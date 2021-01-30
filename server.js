import express from "express";
import colors from "colors";
import xss from "xss-clean";
import helmet from "helmet";
import { config } from "dotenv";
import rateLimit from "express-rate-limit";
import router from "./routes/index.js";

const app = express();

config();
colors.enable();
const dev = process.env.NODE_ENV !== "production";

if (!dev) {
  app.set("trust proxy", 1);
}

app.use(xss());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`[Server] listening on port ${PORT}...🚀`.cyan)
);
