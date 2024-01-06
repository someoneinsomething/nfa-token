// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NotFairToken is ERC20, Ownable {
    address public minter;

    uint256 private constant MAX_SUPPLY = 500 * 10**9 * 10**18; // 500 billions
    uint256 private constant MAX_BUY_PERCENTAGE = 1;

    constructor() ERC20("NotFair", "NFA") Ownable(msg.sender) {
    }

    function mint(address to) external onlyOwner {
        require(to != address(0), "Invalid mint address");
        require(totalSupply() + MAX_SUPPLY <= MAX_SUPPLY, "Exceeds maximum supply");

        minter = to;

        _mint(to, MAX_SUPPLY);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        if (!_isOwner() && !_isMinter()) {
            require(amount + balanceOf(recipient) <= MAX_SUPPLY * MAX_BUY_PERCENTAGE / 100, "Exceeds maximum buy percentage");
        }
        return super.transfer(recipient, amount);
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        if (!_isOwner() && !_isMinter()) {
            require(amount + balanceOf(recipient) <= MAX_SUPPLY * MAX_BUY_PERCENTAGE / 100, "Exceeds maximum buy percentage");
        }
        return super.transferFrom(sender, recipient, amount);
    }

    function _isOwner() internal view returns (bool) {
        return owner() == _msgSender();
    }

    function _isMinter() internal view returns (bool) {
        return minter == _msgSender();
    }
}