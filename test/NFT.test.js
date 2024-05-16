// test/NFT.test.js
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
    // Get the ContractFactory and Signers here.
    NFT = await ethers.getContractFactory("NFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new contract before each test.
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
  });
});
