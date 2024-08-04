import createTable from "./create_table";
import alchemy_crawler from "./alchemy";
import dappradar_crawler from "./dappradar";
import coinbase_crawler from "./coinbase";
import coinmarketcap_crawler from "./coinmarketcap";
import defiLlama_crawler from "./defillama";
import debank from "./debank";
import debank_crawler from "./debank";
// import test_crawler from "./test";

/**
 * ToDo
 * 1. 爬取数据时，需要给每个 Dapp 一个唯一的 ID，这样每次重新爬取数据的时候才不会重复
 * 2. Dappradar 的 API 免费额度我已经用完，所以数据拿不到了，建议充点钱
 * 3. coinmarketcap 爬取数据时还存在一些问题：有些Dapp的数据能爬到，有些 Dapp 的数据爬不到
 * 4. Coinbase 的部分数据也爬不到，爬虫程序需要再优化
 * 4. 各网站数据源：（跟 sites.ts 里面的不一样）
 * Alchemy: "https://www.alchemy.com/dapps",
 * DappRadar: "https://dappradar.com/api",
 * Coinbase: "https://www.coinbase.com/web3",
 * Coinmarketcap: "https://coinmarketcap.com",
 * Debank: "https://docs.cloud.debank.com/en/readme/api-pro-reference/protocol",
 * DefiLlama: "https://defillama.com/docs/api",
 * Etherscan: "https://docs.etherscan.io/", 有 API 但是没有找到 Dapp 相关的 endpoint
 * TokenPocket: "https://github.com/TP-Lab/tokens", 主要是 token 的数据
 * ScamSniffer: "https://github.com/scamsniffer/scam-database/blob/main/blacklist/domains.json", // 纯黑名单服务，有公开json列表
 * MetaMask: "https://github.com/MetaMask/eth-phishing-detect/blob/main/src/config.json"", // 白名单 500 个，黑名单 5000 多个，有公开json列表并实时更新
 * **/

async function run() {
  // Create a database if it doesn't exist
  await createTable().catch(console.error);

  // Run crawlers
  // await alchemy_crawler();
  // await dappradar_crawler();
  await coinbase_crawler();
  // await coinmarketcap_crawler();
  await defiLlama_crawler();
  await debank_crawler();
  // await test_crawler();
}

// run crawler once a week
// const interval = 1000 * 60 * 60 * 24 * 7; // 1 week
// setInterval(run, interval);

run()
