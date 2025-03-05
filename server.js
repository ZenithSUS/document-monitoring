import express from "express";
import cors from "cors";
import path from "path";
import users from "./routes/users.js";
import { fileURLToPath } from "url";
import { logger } from "./middleware/logger.js";
import { notFound, error } from "./middleware/errors.js";

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "*",
  })
);

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use('/api/users', users);

app.use(notFound);
app.use(error);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})