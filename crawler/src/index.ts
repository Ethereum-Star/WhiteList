import alchemy_crawler from "./alchemy";

async function run() {
  await alchemy_crawler();
}

// run crawler once a week
// const interval = 1000 * 60 * 60 * 24 * 7; // 1 week
// setInterval(run, interval);

run();
