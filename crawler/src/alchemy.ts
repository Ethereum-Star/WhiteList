import { sites } from "../sites";
import axios from "axios";
import cheerio from "cheerio";
import { DappList } from "../../types";

async function alchemy_crawler() {
  const url = sites.Alchemy;
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // .is--dapp
    const dappList: DappList[] = [];
    $(".is--dapp").each(function () {
      const element = this;
      const site_name = "Alchemy";
      const dapp_name = $(element).find(".heading-style-h5").text();
      //  get dapp_url from <a> href
      const dapp_href = $(element).find("a").attr("href") || "";
      const lastSlashIndex = dapp_href.lastIndexOf("/");
      const textAfterLastSlash = dapp_href.substr(lastSlashIndex + 1);
      const dapp_page_response = axios.get(`${url}/${textAfterLastSlash}`);
      dapp_page_response.then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        // console.log($("title").text());
        // get dapp_url from <a> href with class .apps-button
        const dapp_url = $(this).find(".apps-buttun").text() || "N/A";
        console.log(dapp_url);
        const dapp: DappList = {
          site_name,
          dapp_name,
          dapp_url,
          contract_addr: "",
        };
        dappList.push(dapp);
        // console.log(dapp);
      });
    });
  } catch (error) {
    console.error("Error occurred during web scraping:", error);
  }
  console.log();
}

export default alchemy_crawler;
