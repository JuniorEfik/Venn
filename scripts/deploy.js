#!/usr/bin/env node
const hre = require("hardhat");

async function main() {
  /**
   * @dev make sure the first argument has the same name as your contract in the SoulBoundTest.sol file
   * @dev the second argument must be the message we want to set in the contract during the deployment process
   */
  const contract = await hre.ethers.deployContract("SoulBoundTest", ["0x10eda8ab8cccc9f79009b5ad43c4ac7b8f0b1600"]);

  await contract.waitForDeployment();

  console.log(`Holesky contract deployed to ${contract.target}`);
}

//DEFAULT BY HARDHAT:
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});