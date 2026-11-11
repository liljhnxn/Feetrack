import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("-----------------------------------------");
  console.log("Deploying FeeTrack contract with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const symbol = chainId === 677 ? "BOT" : "BOHR";
  console.log("Network:", network.name, `(Chain ID: ${chainId})`);
  console.log("Account balance:", ethers.formatEther(balance), symbol);

  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
  console.log("Optimized deployment gas price:", ethers.formatUnits(gasPrice, "gwei"), "Gwei");

  const FeeTrack = await ethers.getContractFactory("FeeTrack");
  const feeTrack = await FeeTrack.deploy({ gasPrice });
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

  const rpcUrl = chainId === 677 ? "https://rpc.botchain.ai" : "https://rpc.bohr.life";
  const explorerUrl = chainId === 677 ? "https://scan.botchain.ai" : "https://scan.bohr.life";

  const envVars: Record<string, string> = {
    NEXT_PUBLIC_FEETRACK_ADDRESS: contractAddress,
    NEXT_PUBLIC_BOTCHAIN_RPC_URL: rpcUrl,
    NEXT_PUBLIC_BOTCHAIN_CHAIN_ID: chainId.toString(),
    NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL: explorerUrl,
    NEXT_PUBLIC_CURRENCY_SYMBOL: symbol,
  };

  for (const [key, val] of Object.entries(envVars)) {
    const regex = new RegExp(`^${key}=.*$`, "m");
    if (regex.test(envLocalContent)) {
      envLocalContent = envLocalContent.replace(regex, `${key}=${val}`);
    } else {
      envLocalContent += `\n${key}=${val}`;
    }
  }

  fs.writeFileSync(envLocalPath, envLocalContent.trim() + "\n");
  console.log("Updated .env.local with deployed contract and network config");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
