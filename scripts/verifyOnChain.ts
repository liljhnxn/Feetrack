import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const contractAddress = "0x734Ff1ff575f3229A896761694B235Ea53B780A3";
  console.log("Checking deployed contract on Botchain Mainnet at:", contractAddress);

  const FeeTrack = await ethers.getContractFactory("FeeTrack");
  const feeTrack = FeeTrack.attach(contractAddress);

  const totalFees = await (feeTrack as any).getTotalFees();
  console.log("Total fees recorded on-chain:", totalFees.toString());

  const stats = await (feeTrack as any).getFeeStatistics();
  console.log("Statistics on-chain:", {
    totalRecords: stats[0].toString(),
    paidRecords: stats[1].toString(),
    unpaidRecords: stats[2].toString(),
    totalAmount: ethers.formatEther(stats[3]) + " BOT",
  });

  console.log("Contract is live, responsive, and verified on Botchain Mainnet!");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
