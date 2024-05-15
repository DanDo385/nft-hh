// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {
    uint256 public tokenCount;
    
    constructor() ERC721("NFT Collection", "NFTC") {}

    function mint(string memory tokenURI) external onlyOwner returns (uint256) {
        tokenCount++;
        _mint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, tokenURI);
        return tokenCount;
    }
}
