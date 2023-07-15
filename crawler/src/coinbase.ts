import { sites } from "../sites";
import cheerio from "cheerio";
import { DappList } from "../../types";
import { Pool } from "pg";
import { PoolData } from "../../database";
import Puppeteer from "puppeteer";

async function coinbase_crawler() {
  const pageSize = 1000; // current max page size is 800, but it may change in the future, so we set it to 1000
  const url = `${sites.Coinbase}?pageSize=${pageSize}`;
  let dappList: DappList[] = [];

  const pool = new Pool(PoolData);

  try {
    const browser = await Puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();
    await page.goto(url);
    let html = await page.content();
    const $ = cheerio.load(html);
    page.close();

    const promises: Promise<void>[] = [];
    // get every url of dapp page
    $(
      "div.cds-flex-f1g67tkn.cds-flex-end-f9tvb5a.cds-column-ci8mx7v.cds-center-czxavit"
    ).each(function () {
      const element = this;
      //  get dapp_url from <a> href
      const dapp_href = $(element).find("a").attr("href") || "";
      const newpageurl = `https://www.coinbase.com/${dapp_href}`;
      // create new page for each dapp
      try {
        // create a promise for each page, create new page, and goto newpageurl
        const promise = new Promise<void>(async (resolve, reject) => {
          const newpage = await browser.newPage();
          await newpage.goto(newpageurl, {
            timeout: 0,
            waitUntil: "load",
          });
          let html = await newpage.content();
          const $ = cheerio.load(html);
          const dapp_name = $(
            "h1.cds-typographyResets-t1xhpuq2.cds-title1-t16z3je5.cds-foreground-f1yzxzgu.cds-transition-txjiwsi.cds-start-s1muvu8a.cds-numberOfLines-n6pg8f8"
          ).text();
          const dapp_url =
            $("a.DappDetailsSection__StyledLink-sc-1x88i2m-1.iyTMHE").attr(
              "href"
            ) || "";
          const dapp: DappList = {
            site_name: "Coinbase",
            dapp_name,
            dapp_url,
            contract_addr: "",
          };
          dappList.push(dapp);
          await newpage.close();
          resolve();
        });

        promises.push(promise);
      } catch (error) {
        // throw new Error(`Error occurred during creating new page: ${error}`);
        console.error(`Error occurred during creating new page: ${error}`);
      }
    });

    await Promise.all(promises);

    browser.close();

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
        console.log("Coinbase dapp list inserted successfully!");
      } catch (error) {
        console.error(
          "Error occurred during inserting Coinbase dapp list:",
          error
        );
      } finally {
        client.release();
      }
    }
  } catch (error) {
    console.error("Error occurred during crawling Coinbase:", error);
  }
}

export default coinbase_crawler;
