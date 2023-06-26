// test crawler is used to test the crawler
import { sites } from "../sites";
import axios from "axios";
import cheerio from "cheerio";
import { DappList } from "../../types";

async function test_crawler() {
  const url = sites.Alchemy;
  try {
    const response = await axios.get(`${url}/opensea`);
    const html = response.data;
    const $ = cheerio.load(html);

    // get .apps-button
    const dapp_url = (await $(".apps-button").attr("href")) || "N/A";
    console.log(dapp_url);
  } catch (error) {
    console.error("Error occurred during web scraping:", error);
  }
}

export default test_crawler;
