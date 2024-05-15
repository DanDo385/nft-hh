const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();

  await nft.deployed();

  console.log("NFT contract deployed to:", nft.address);

  // Save the contract's deployed address
  const artifactsDir = path.resolve(__dirname, '../artifacts');
  if (!fs.existsSync(artifactsDir)){
    fs.mkdirSync(artifactsDir);
  }

  const contractAddress = {
    address: nft.address,
  };

  const addressFilePath = path.join(artifactsDir, 'NFT_address.json');
  fs.writeFileSync(addressFilePath, JSON.stringify(contractAddress, null, 2));
  console.log(`Contract address saved to ${addressFilePath}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
