let chai;
let expect;

before(async () => {
  chai = await import('chai');
  chai.use((await import('ethereum-waffle')).solidity);
  expect = chai.expect;
});

const { ethers } = require("hardhat");

describe("NFT", function () {
  let NFT;
  let nft;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    NFT = await ethers.getContractFactory("NFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    nft = await NFT.deploy();
    await nft.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should have 0 tokens initially", async function () {
      const tokenCount = await nft.tokenCount();
      expect(tokenCount).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint a new token to the owner", async function () {
      const mintTx = await nft.connect(owner).mint("tokenURI1");
      await mintTx.wait();

      const tokenCount = await nft.tokenCount();
      expect(tokenCount).to.equal(1);
      expect(await nft.ownerOf(1)).to.equal(owner.address);
      expect(await nft.tokenURI(1)).to.equal("tokenURI1");
    });

    it("Should fail if non-owner tries to mint", async function () {
      await expect(nft.connect(addr1).mint("tokenURI1")).to.be.revertedWith("Caller is not the owner");
    });

    it("Should mint successfully with explicit gas limit", async function () {
      const mintTx = await nft.connect(owner).mint("ipfs://validCID", { gasLimit: 500000 });
      await expect(mintTx.wait()).to.not.be.reverted;
    });

    it("Should estimate gas correctly", async function () {
      const estimatedGas = await nft.connect(owner).estimateGas.mint("ipfs://validCID");
      console.log(`Estimated Gas: ${estimatedGas}`);
      expect(estimatedGas).to.be.below(500000, "Gas estimate is too high, possible issues in contract execution");
    });

    it("Should handle extremely long token URIs", async function () {
      const longURI = "ipfs://" + "x".repeat(1000); // Very long URI
      await expect(nft.connect(owner).mint(longURI)).to.emit(nft, 'Transfer');
    });

    it("Should revert on empty token URI", async function () {
      await expect(nft.connect(owner).mint("")).to.be.revertedWith("URI cannot be empty"); // Make sure your contract checks this
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      const transferTx = await nft.connect(owner).transferOwnership(addr1.address);
      await transferTx.wait();

      expect(await nft.owner()).to.equal(addr1.address);
    });

    it("Should prevent non-owners from transferring ownership", async function () {
      await expect(nft.connect(addr2).transferOwnership(addr1.address)).to.be.revertedWith("Caller is not the owner");
    });

    it("Ownership should restrict minting after transfer", async function () {
      await nft.connect(owner).transferOwnership(addr1.address);
      await expect(nft.connect(owner).mint("ipfs://validCID")).to.be.revertedWith("Caller is not the owner");
    });
  });

  describe("Network and JSON-RPC Tests", function () {
    it("Should connect to the network", async function () {
      const provider = ethers.provider;
      const network = await provider.getNetwork();
      console.log("Connected to network:", network.name, network.chainId);
      expect(network).to.have.property('chainId');
    });

    it("Should get the latest block", async function () {
      const provider = ethers.provider;
      const block = await provider.getBlock("latest");
      console.log("Latest block number:", block.number);
      expect(block).to.have.property('number');
    });

    it("Should send a transaction and get transaction receipt", async function () {
      const [sender] = await ethers.getSigners();
      const tx = await sender.sendTransaction({
        to: sender.address, // Sending ether to themselves just for testing
        value: ethers.utils.parseEther("0.1"),
      });
      const receipt = await tx.wait();
      console.log("Transaction successful with hash:", tx.hash);
      expect(receipt).to.have.property('status', 1);
    });
  });
});
