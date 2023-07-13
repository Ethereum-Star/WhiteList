import axios from "axios";
import { DappList } from "../../types";
import { Pool } from "pg";
import { PoolData } from "../../database";
import dotenv from "dotenv";
dotenv.config();

async function dappradar_crawler() {
  const dappList: DappList[] = [];
  const pool = new Pool(PoolData);
  const project = "4tsxo4vuhotaojtl";

  try {
    const initialQuery = new URLSearchParams({
      page: "1",
      resultsPerPage: "50",
    }).toString();

    // get total page number
    const initialResponse = await axios.get(
      `https://api.dappradar.com/${project}/dapps?${initialQuery}`,
      {
        headers: {
          "X-BLOBR-KEY": process.env.X_BLOBR_KEY,
        },
      }
    );
    let totalPage = initialResponse.data.pageCount;

    // get dapp list
    for (let page = 1; page <= totalPage; page++) {
      console.log(`Crawling DappRadar page ${page}...`);

      const query = new URLSearchParams({
        page: page.toString(),
        resultsPerPage: "50",
      }).toString();

      const response = await axios.get(
        `https://api.dappradar.com/${project}/dapps?${query}`,
        {
          headers: {
            "X-BLOBR-KEY": process.env.X_BLOBR_KEY,
          },
        }
      );

      const dapps = response.data.results;

      for (const dapp of dapps) {
        const dappInfo: DappList = {
          site_name: "DappRadar",
          dapp_name: dapp.name,
          dapp_url: dapp.website,
          contract_addr: "",
        };
        dappList.push(dappInfo);
      }
    }

    // insert dappList into database
    if (dappList.length > 0) {
      const client = await pool.connect();
      try {
        const insertQuery = `INSERT INTO dapp_list(site_name, dapp_name, dapp_url, contract_addr) VALUES($1, $2, $3, $4)`;
        for (const dapp of dappList) {
          await client.query(insertQuery, [
            dapp.site_name,
            dapp.dapp_name,
            dapp.dapp_url,
            dapp.contract_addr,
          ]);
        }
        console.log("Dappradar dapp list inserted successfully!");
      } catch (error) {
        console.error("Error occurred during inserting dapp list:", error);
      } finally {
        client.release();
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export default dappradar_crawler;
