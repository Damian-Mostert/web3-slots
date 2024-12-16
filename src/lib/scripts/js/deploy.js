const deployContract = require("../lib/deploy-contract");
async function main() {
  await deployContract("Bid",[]);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
