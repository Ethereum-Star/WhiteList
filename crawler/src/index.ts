import createTable from "./create_table";
import alchemy_crawler from "./alchemy";
import dappradar_crawler from "./dappradar";
import coinbase_crawler from "./coinbase";
// import test_crawler from "./test";

async function run() {
  // Create a database if it doesn't exist
  await createTable().catch(console.error);
  await coinbase_crawler();
  // Run crawlers
  // await alchemy_crawler();
  // await dappradar_crawler();

  // await test_crawler();
}

// run crawler once a week
// const interval = 1000 * 60 * 60 * 24 * 7; // 1 week
// setInterval(run, interval);

run();
