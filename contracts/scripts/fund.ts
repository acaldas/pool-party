import { ethers, network } from "hardhat";

const ME = "0xe7D3411130817E5d0172540adC56C354004e9613";

const BNB_HOLDER = "0x0d0707963952f2fba59dd06f2b425ace40b492fe";

const ACCU = "0x9cb949e8c256C3EA5395bbe883E6Ee6a20Db6045";
const ACCU_HOLDER = "0x851e5A29Ffa7651Ca7f94e166D52376f3315a092";

const TRUTH = "0x55a633B3FCe52144222e468a326105Aa617CC1cc";
const BUSD = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
const BUSD_HOLDER = "0x8894e0a0c962cb723c1976a4421c95949be2d4e3";

async function fundBNB() {
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [BUSD_HOLDER], // replace with desired account address
  });
  const signer = await ethers.provider.getSigner(BUSD_HOLDER);

  console.log(await signer.getBalance());
  const tx = await signer.sendTransaction({
    to: ME,
    value: ethers.utils.parseEther("100"),
  });
  console.log(`BNB Transaction hash: ${tx.hash}`);
}

async function main() {
  // Replace with the amount of tokens you want to fund with
  const amount = ethers.utils.parseUnits("30", 18); // 1000 tokens with 18 decimal places

  // Impersonate an account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [BUSD_HOLDER], // replace with desired account address
  });

  // Get signer with the impersonated account
  const signer = await ethers.provider.getSigner(BUSD_HOLDER); // replace with desired account address

  // Create an instance of the ERC20 token contract
  const erc20 = await ethers.getContractAt("IERC20", BUSD, signer);
  //   const result = await network.provider.request({
  //     method: "eth_getCode",
  //     params: [BUSD],
  //   });
  //   console.log(result);

  // Fund your account with the ERC20 tokens
  const tx = await erc20.transfer(ME, amount);
  console.log(`Transaction hash: ${tx.hash}`);
}

fundBNB()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
