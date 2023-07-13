import { sites } from "../sites";
import axios from "axios";
import cheerio from "cheerio";
import { DappList } from "../../types";
import { Pool } from "pg";
import { PoolData } from "../../database";

async function alchemy_crawler() {
  const url = sites.Alchemy;
  let currentPage = 1; // current page number
  let dappList: DappList[] = [];

  const pool = new Pool(PoolData);

  try {
    const response = await axios.get(`${url}?8c945ae6_page=${currentPage}`);
    let html = response.data;
    while (true) {
      console.log(`Crawling Alchemy page ${currentPage}...`);
      let $ = cheerio.load(html);

      // .is--dapp
      const promises: Promise<void>[] = [];
      $(".is--dapp").each(function () {
        const element = this;
        const site_name = "Alchemy";
        const dapp_name = $(element).find(".heading-style-h5").text();
        //  get dapp_url from <a> href
        const dapp_href = $(element).find("a").attr("href") || "";
        const lastSlashIndex = dapp_href.lastIndexOf("/");
        const textAfterLastSlash = dapp_href.substr(lastSlashIndex + 1);
        const dapp_page_response = axios.get(`${url}/${textAfterLastSlash}`);
        const promise = dapp_page_response.then(async (response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          const dapp_url = (await $(".apps-button").attr("href")) || "N/A";
          const dapp: DappList = {
            site_name,
            dapp_name,
            dapp_url,
            contract_addr: "",
          };
          dappList.push(dapp);
        });
        promises.push(promise);
      });

      await Promise.all(promises);
      // console.log("Alchemy dapp list:", dappList.length);

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
          console.log("Alchemy dapp list inserted successfully!");
        } catch (error) {
          console.error("Error occurred during inserting dapp list:", error);
        } finally {
          client.release();
        }
        dappList = [];
      }

      // get next page
      const nextPageButton = $(".cms-load_next-button");
      if (nextPageButton.length) {
        // if there is next page button
        const nextPageUrl = nextPageButton.attr("href");
        if (nextPageUrl) {
          // use axios to get next page
          const nextPageResponse = await axios.get(`${url}/${nextPageUrl}`);
          // update html and $ for next page
          currentPage++;
          html = nextPageResponse.data;
          $ = cheerio.load(html);
        } else {
          // if there is no next page button, end the loop
          break;
        }
        // 10s delay
        await new Promise((resolve) => setTimeout(resolve, 10000));
      } else {
        // if there is no next page button, end the loop
        break;
      }
    }
  } catch (error) {
    console.error("Error occurred during alchemy scraping:", error);
  }
}

export default alchemy_crawler;
