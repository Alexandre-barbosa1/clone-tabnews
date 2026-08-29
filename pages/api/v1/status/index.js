import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConectionsValues =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnetionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnetionsvalues =
    databaseOpenedConnetionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependecies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConectionsValues),
        opened_connections: databaseOpenedConnetionsvalues,
      },
    },
  });
}

export default status;
