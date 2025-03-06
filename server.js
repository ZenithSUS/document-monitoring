import express from "express";
import cors from "cors";
import path from "path";
import admin from "firebase-admin";
import users from "./routes/users.js";
import documents from "./routes/documents.js";
import { fileURLToPath } from "url";
import { logger } from "./middleware/logger.js";
import { notFound, error } from "./middleware/errors.js";

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.SERVICE_TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT,
    client_x509_cert_url: process.env.CLIENT_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
  }),
});

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

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use("/api/users", users);
app.use("/api/documents", documents);

app.use(notFound);
app.use(error);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
