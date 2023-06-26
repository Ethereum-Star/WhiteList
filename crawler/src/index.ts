import alchemy_crawler from "./alchemy";
// import test_crawler from "./test";
import createTable from "./create_table";

async function run() {
  // Create a database if it doesn't exist
  await createTable().catch(console.error);
  await alchemy_crawler();
  // await test_crawler();
}

// run crawler once a week
// const interval = 1000 * 60 * 60 * 24 * 7; // 1 week
// setInterval(run, interval);

run();
