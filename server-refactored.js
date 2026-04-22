import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger.js";
import { getDb, closeDb } from "./db.js";
import routes from "./src/routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.static(__dirname));

// Force an explicit CSP that allows local app-specific DevTools polling
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:3001 ws://localhost:3001; img-src 'self' data:; script-src 'self' 'unsafe-inline' unpkg.com cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' unpkg.com cdn.jsdelivr.net; font-src 'self' data: unpkg.com cdn.jsdelivr.net;"
  );
  next();
});

// Chrome DevTools discovery endpoint (required for certain remote/extension workflows)
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) =>
  res.json([])
);

// ─── SWAGGER DOCS ────────────────────────────────────────────────
app.get("/api-docs/swagger.json", (req, res) => res.json(specs));
app.get("/api-docs", (req, res) => {
  res.sendFile(new URL("./swagger-ui-index.html", import.meta.url).pathname);
});
app.use(
  "/api-docs/ui",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: {
      url: "/api-docs/swagger.json",
      persistAuthorization: true,
    },
  })
);

// Simulated latency
app.use((req, res, next) => {
  setTimeout(next, Math.random() * 100 + 30);
});

// ─── API ROUTES (MVC Structure) ──────────────────────────────────
app.use("/api/v1", routes);

// ─── START ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  getDb();
  console.log(
    `\n🚀 Forum API → http://localhost:${PORT}\n   DB: SQLite (forum.db) — zero config\n`
  );
  console.log(`📚 Swagger UI → http://localhost:${PORT}/api-docs\n`);
  console.log(
    `   GET  /api/v1/questions    GET  /api/v1/users`
  );
  console.log(
    `   GET  /api/v1/tags         GET  /api/v1/search?q=...`
  );
  console.log(
    `   GET  /api/v1/stats        GET  /api/v1/health\n`
  );
});

process.on("SIGINT", () => {
  closeDb();
  process.exit(0);
});
