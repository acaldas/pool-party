import { expect } from "chai";
import hre from "hardhat";
import { PoolManager } from "../typechain-types";

const ACCU = "0x9cb949e8c256C3EA5395bbe883E6Ee6a20Db6045";
const TRUTH = "0x55a633B3FCe52144222e468a326105Aa617CC1cc";
const BUSD = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";

describe("Daily pool", function () {
  it("Should set pool manager", async function () {
    const PoolManager = await hre.ethers.getContractFactory("PoolManager");
    const poolManager = await PoolManager.deploy(
      "0x0000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000"
    );

    const Pool = await hre.ethers.getContractFactory("DailyPool");
    const pool = await Pool.deploy(
      ACCU,
      TRUTH,
      BUSD,
      "0x0000000000000000000000000000000000000000",
      poolManager.address
    );
    poolManager.setPool(0, pool.address);

    const [owner] = await hre.ethers.getSigners();
    expect(await poolManager.getOwner()).to.equal(owner.address);
    expect(await pool.poolManager()).to.equal(poolManager.address);
  });
});
