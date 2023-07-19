import { sites } from "../sites";
import axios from "axios";
import cheerio from "cheerio";
import { DappList } from "../../types";
import { Pool } from "pg";
import { PoolData } from "../../database";

async function coinmarketcap_crawler() {
  const url = sites.Coinmarketcap;
  let currentPage = 1; // current page number
  let dappList: DappList[] = [];

  const pool = new Pool(PoolData);

  try {
    const response = await axios.get(`${url}/?page=${currentPage}`);
    let html = response.data;
    while (true) {
      console.log(`Crawling Coinmarketcap page ${currentPage}...`);
      let $ = cheerio.load(html);

      const promises: Promise<void>[] = [];
      $("tbody tr").each(function () {
        // get third td in tr
        const element = $(this).find("td").eq(2);
        // get a href in td.div.a
        const dapp_href = element.find(".cmc-link").attr("href") || "";
        // wait for a few seconds

        const dapp_page_response = axios.get(`${url}${dapp_href}`);

        const promise = dapp_page_response.then(async (response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          const dapp_name =
            (await $(".sc-16891c57-0 .iSrqCq").attr("title")) || "N/A";
          console.log(`${dapp_href}: ${dapp_name}`);
          //   const dapp: DappList = {
          //     site_name: "Coinmarketcap",
          //     dapp_name,
          //     dapp_url,
          //     contract_addr: "",
          //   };
          //   dappList.push(dapp);
        });
        promises.push(promise);
      });

      await Promise.all(promises);
      // console.log("Alchemy dapp list:", dappList.length);

      // insert dappList into database
      //   if (dappList.length > 0) {
      //     const client = await pool.connect();
      //     try {
      //       const insertQuery = `INSERT INTO dapp_list(site_name, dapp_name, dapp_url, contract_addr) VALUES($1, $2, $3, $4)`;
      //       for (const dapp of dappList) {
      //         await client.query(insertQuery, [
      //           dapp.site_name,
      //           dapp.dapp_name,
      //           dapp.dapp_url,
      //           dapp.contract_addr,
      //         ]);
      //       }
      //       console.log("Alchemy dapp list inserted successfully!");
      //     } catch (error) {
      //       console.error("Error occurred during inserting dapp list:", error);
      //     } finally {
      //       client.release();
      //     }
      //     dappList = [];
      //   }

      //   // get next page
      //   const nextPageButton = $(".cms-load_next-button");
      //   if (nextPageButton.length) {
      //     // if there is next page button
      //     const nextPageUrl = nextPageButton.attr("href");
      //     if (nextPageUrl) {
      //       // use axios to get next page
      //       const nextPageResponse = await axios.get(`${url}/${nextPageUrl}`);
      //       // update html and $ for next page
      //       currentPage++;
      //       html = nextPageResponse.data;
      //       $ = cheerio.load(html);
      //     } else {
      //       // if there is no next page button, end the loop
      //       break;
      //     }
      //     // 10s delay
      //     await new Promise((resolve) => setTimeout(resolve, 10000));
      //   } else {
      //     // if there is no next page button, end the loop
      //     break;
      //   }
    }
  } catch (error) {
    console.error("Error occurred during coinmarketcap scraping:", error);
  }
}

export default coinmarketcap_crawler;
