import { sites } from "../sites";
import axios from "axios";
import cheerio from "cheerio";
import { DappList } from "../../types";
import { Pool } from "pg";
import { PoolData } from "../../database";

async function alchemy_crawler() {
  const url = sites.Alchemy;
  let currentPage = 1; // 当前页码
  let dappList: DappList[] = [];

  const pool = new Pool(PoolData);

  try {
    const response = await axios.get(`${url}?8c945ae6_page=${currentPage}`);
    let html = response.data;
    while (true) {
      console.log(`Crawling page ${currentPage}...`);
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

      // 模拟点击 Next 按钮
      const nextPageButton = $(".cms-load_next-button"); // 根据实际情况选择正确的选择器
      if (nextPageButton.length) {
        // 如果存在下一页按钮
        const nextPageUrl = nextPageButton.attr("href");
        if (nextPageUrl) {
          // 使用 axios 或其他库发送 GET 请求获取下一页的内容
          const nextPageResponse = await axios.get(`${url}/${nextPageUrl}`);
          // 更新当前页码和 HTML 内容
          currentPage++;
          html = nextPageResponse.data;
          $ = cheerio.load(html);
        } else {
          // 如果没有下一页的 URL，表示已经到达最后一页，结束循环
          break;
        }
        // 暂停 10 秒钟，避免对服务器造成太大压力
        await new Promise((resolve) => setTimeout(resolve, 10000));
      } else {
        // 如果没有下一页按钮，表示已经到达最后一页，结束循环
        break;
      }
    }
  } catch (error) {
    console.error("Error occurred during web scraping:", error);
  }
}

export default alchemy_crawler;
