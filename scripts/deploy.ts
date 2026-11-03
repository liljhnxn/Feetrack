import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("-----------------------------------------");
  console.log("Deploying FeeTrack contract with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH/BOHR");

  const FeeTrack = await ethers.getContractFactory("FeeTrack");
  const feeTrack = await FeeTrack.deploy();
  await feeTrack.waitForDeployment();

  const contractAddress = await feeTrack.getAddress();
  const txHash = feeTrack.deploymentTransaction()?.hash;

  console.log("FeeTrack deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Transaction Hash:", txHash);
  console.log("-----------------------------------------");

  // Save deployed address and network info to lib/deployedAddress.json
  const deployInfo = {
    address: contractAddress,
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployedAt: new Date().toISOString(),
    txHash: txHash,
  };

  const libDir = path.join(process.cwd(), "lib");
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(libDir, "deployedAddress.json"),
    JSON.stringify(deployInfo, null, 2)
  );
  console.log("Deployment info written to lib/deployedAddress.json");

  // Also automatically update .env.local for Next.js frontend
  const envLocalPath = path.join(process.cwd(), ".env.local");
  let envLocalContent = "";
  if (fs.existsSync(envLocalPath)) {
    envLocalContent = fs.readFileSync(envLocalPath, "utf-8");
  }

  if (envLocalContent.includes("NEXT_PUBLIC_FEETRACK_ADDRESS=")) {
    envLocalContent = envLocalContent.replace(
      /NEXT_PUBLIC_FEETRACK_ADDRESS=.*/,
      `NEXT_PUBLIC_FEETRACK_ADDRESS=${contractAddress}`
    );
  } else {
    envLocalContent += `\nNEXT_PUBLIC_FEETRACK_ADDRESS=${contractAddress}\n`;
  }

  fs.writeFileSync(envLocalPath, envLocalContent.trim() + "\n");
  console.log("Updated NEXT_PUBLIC_FEETRACK_ADDRESS in .env.local");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
