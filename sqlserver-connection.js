import * as dotenv from "dotenv";

dotenv.config();

const DEFAULT_CONNECTION_TIMEOUT_MS = 15000;
const DEFAULT_REQUEST_TIMEOUT_MS = 15000;
const LOCAL_ALIASES = new Set([".", "(local)"]);
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

const parseBoolean = (value, defaultValue) => {
  if (value === undefined) {
    return defaultValue;
  }

  return value === "true";
};

const parseInteger = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

export const usesIntegratedSecurity = (env = process.env) =>
  env.DB_INTEGRATED_SECURITY !== "false";

const normalizeServerForTedious = (server) =>
  LOCAL_ALIASES.has((server || "").toLowerCase()) ? "localhost" : server;

const buildTrustedConnectionString = (env = process.env) => {
  const requestedServer = env.DB_SERVER || ".";
  const server = LOCAL_HOSTS.has(requestedServer.toLowerCase())
    ? "."
    : requestedServer;
  const instanceName = env.DB_INSTANCE || "";
  const database = env.DB_NAME || "discussion_forum";
  const port = parseInteger(env.DB_PORT, 1433);
  const encrypt = parseBoolean(env.DB_ENCRYPT, false) ? "Yes" : "No";
  const trustServerCertificate = parseBoolean(
    env.DB_TRUST_CERTIFICATE,
    true
  )
    ? "Yes"
    : "No";
  const serverTarget = instanceName
    ? `${server}\\${instanceName}`
    : LOCAL_ALIASES.has(server.toLowerCase())
      ? server
      : `${server},${port}`;

  return [
    "Driver={ODBC Driver 17 for SQL Server}",
    `Server=${serverTarget}`,
    `Database=${database}`,
    "Trusted_Connection=Yes",
    `Encrypt=${encrypt}`,
    `TrustServerCertificate=${trustServerCertificate}`,
  ].join(";");
};

export async function loadSqlDriver(env = process.env) {
  const integratedSecurity = usesIntegratedSecurity(env);
  const moduleName = integratedSecurity ? "mssql/msnodesqlv8.js" : "mssql";

  try {
    const module = await import(moduleName);
    return module.default;
  } catch (err) {
    if (
      integratedSecurity &&
      (err.code === "ERR_MODULE_NOT_FOUND" ||
        err.message.includes("Cannot find package"))
    ) {
      throw new Error(
        "DB_INTEGRATED_SECURITY=true requires the optional `msnodesqlv8` package. Run `npm install msnodesqlv8` before starting the API."
      );
    }

    throw err;
  }
}

export function buildSqlServerConfig(env = process.env) {
  const integratedSecurity = usesIntegratedSecurity(env);
  const database = env.DB_NAME || "discussion_forum";
  const connectionTimeout = parseInteger(
    env.DB_CONNECTION_TIMEOUT,
    DEFAULT_CONNECTION_TIMEOUT_MS
  );
  const requestTimeout = parseInteger(
    env.DB_REQUEST_TIMEOUT,
    DEFAULT_REQUEST_TIMEOUT_MS
  );

  if (integratedSecurity) {
    return {
      driver: "msnodesqlv8",
      connectionString: buildTrustedConnectionString(env),
      database,
      connectionTimeout,
      requestTimeout,
      options: {
        trustedConnection: true,
        useUTC: true,
      },
    };
  }

  return {
    server: normalizeServerForTedious(env.DB_SERVER || "localhost"),
    port: parseInteger(env.DB_PORT, 1433),
    database,
    user: env.DB_USER || "sa",
    password: env.DB_PASSWORD || "",
    connectionTimeout,
    requestTimeout,
    options: {
      encrypt: parseBoolean(env.DB_ENCRYPT, false),
      trustServerCertificate: parseBoolean(env.DB_TRUST_CERTIFICATE, true),
      useUTC: true,
    },
  };
}

export function formatSqlServerTarget(env = process.env) {
  const requestedServer = env.DB_SERVER || ".";
  const server = LOCAL_HOSTS.has(requestedServer.toLowerCase())
    ? "."
    : requestedServer;
  const instanceName = env.DB_INSTANCE || "";
  const port = parseInteger(env.DB_PORT, 1433);
  const database = env.DB_NAME || "discussion_forum";
  const host = instanceName
    ? `${server}\\${instanceName}`
    : LOCAL_ALIASES.has(server.toLowerCase())
      ? server
      : `${server}:${port}`;

  return `${host}/${database}`;
}
