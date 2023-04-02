import { ethers } from "hardhat";

const ACCU = "0x9cb949e8c256C3EA5395bbe883E6Ee6a20Db6045";
const TRUTH = "0x55a633B3FCe52144222e468a326105Aa617CC1cc";
const BUSD = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";

async function main() {
  // Deploy BonusDistributor contract
  // const BonusDistributor = await ethers.getContractFactory(
  //   "BonusDistributor"
  // );
  // const bonusDistributor = await BonusDistributor.deploy(accuToken.address);

  // Deploy Pools
  const PoolManager = await ethers.getContractFactory("PoolManager");
  const poolManager = await PoolManager.deploy(
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000"
  );

  const Pool = await ethers.getContractFactory("DailyPool");
  const pool1 = await Pool.deploy(
    ACCU,
    TRUTH,
    BUSD,
    "0x0000000000000000000000000000000000000000",
    poolManager.address
  );
  const pool2 = await Pool.deploy(
    TRUTH,
    ACCU,
    BUSD,
    "0x0000000000000000000000000000000000000000",
    poolManager.address
  );
  const pool3 = await Pool.deploy(
    BUSD,
    ACCU,
    TRUTH,
    "0x0000000000000000000000000000000000000000",
    poolManager.address
  );

  console.log("Bonus");
  const BonusDistributor = await ethers.getContractFactory("BonusDistributor");
  const bonus1 = await BonusDistributor.deploy(ACCU, poolManager.address);
  const bonus2 = await BonusDistributor.deploy(TRUTH, poolManager.address);
  const bonus3 = await BonusDistributor.deploy(BUSD, poolManager.address);

  await pool1.setBonusDistributor(bonus1.address);
  await pool2.setBonusDistributor(bonus2.address);
  await pool3.setBonusDistributor(bonus3.address);

  poolManager.setPool(0, pool1.address);
  poolManager.setPool(1, pool2.address);
  poolManager.setPool(2, pool3.address);

  console.log("Pool 1 deployed to:", pool1.address);
  console.log("Pool 2 deployed to:", pool2.address);
  console.log("Pool 3 deployed to:", pool3.address);
  console.log("Pool Manager deployed to:", poolManager.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
