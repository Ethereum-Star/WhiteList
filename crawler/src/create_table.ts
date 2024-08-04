import { Pool } from "pg";
import { PoolData } from "../../database";

async function createTable() {
  const pool = new Pool(PoolData);
  const client = await pool.connect();
  try {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS dapp_list(
            id SERIAL PRIMARY KEY,
            site_name VARCHAR(255) NOT NULL,
            dapp_name VARCHAR(255) NOT NULL,
            dapp_url VARCHAR(255) NOT NULL,
            contract_addr VARCHAR(255) NOT NULL
        )`;

    await client.query(createTableQuery);

    console.log("Table created successfully!");

    const createTableBlackListDDL = `CREATE TABLE IF NOT EXISTS dapp_list_blacklist(
            id SERIAL PRIMARY KEY,
            site_name VARCHAR(255) NOT NULL,
            report_site VARCHAR(255) NOT NULL
        )`;

    await client.query(createTableBlackListDDL);

  } catch (error) {
    console.error("Error occurred during creating table:", error);
  } finally {
    client.release();
  }

  await pool.end();
}

export default createTable;
