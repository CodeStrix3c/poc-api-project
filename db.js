import {
  buildSqlServerConfig,
  formatSqlServerTarget,
  loadSqlDriver,
  usesIntegratedSecurity,
} from "./sqlserver-connection.js";

const sql = await loadSqlDriver();

let poolPromise = null;

const config = buildSqlServerConfig();

const connectionHints = () => {
  const hints = [`Connection target: ${formatSqlServerTarget()}`];

  if (usesIntegratedSecurity()) {
    hints.push(
      "Windows authentication is enabled. This project expects the optional `msnodesqlv8` driver to be installed."
    );
    hints.push(
      "For a local default instance, prefer DB_SERVER=. so the ODBC driver can use local SQL Server protocols instead of forcing TCP to localhost:1433."
    );
  } else {
    hints.push(
      "SQL Server authentication is enabled. Double-check DB_USER, DB_PASSWORD, and that TCP/IP is enabled for the target instance."
    );
  }

  return hints.map((hint) => `  - ${hint}`).join("\n");
};

export async function getDb() {
  if (poolPromise) {
    return poolPromise;
  }

  const pool = new sql.ConnectionPool(config);
  pool.on("error", (err) => {
    console.error("Connection pool error:", err);
  });

  poolPromise = pool.connect();

  try {
    return await poolPromise;
  } catch (err) {
    poolPromise = null;
    console.error("Failed to connect to SQL Server:", err);
    console.error("Helpful checks:");
    console.error(connectionHints());
    throw err;
  }
}

export async function closeDb() {
  if (!poolPromise) {
    return;
  }

  const pool = await poolPromise;
  await pool.close();
  poolPromise = null;
}

export async function executeQuery(query, params = {}) {
  const db = await getDb();
  const request = db.request();

  for (const [key, value] of Object.entries(params)) {
    request.input(key, value);
  }

  return request.query(query);
}

export async function executeQueryRows(query, params = {}) {
  const result = await executeQuery(query, params);
  return result.recordset || [];
}

export async function executeQuerySingle(query, params = {}) {
  const rows = await executeQueryRows(query, params);
  return rows[0] || null;
}

export async function executeNonQuery(query, params = {}) {
  const result = await executeQuery(query, params);
  return result.rowsAffected[0] || 0;
}

export default {
  closeDb,
  executeNonQuery,
  executeQuery,
  executeQueryRows,
  executeQuerySingle,
  getDb,
};
