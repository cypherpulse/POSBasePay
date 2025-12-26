// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract POSVault is Ownable, Pausable, ReentrancyGuard {
    address public immutable TREASURY;
    mapping(address => bool) public isMerchant;
    uint256 public constant PROTOCOL_FEE_BPS = 50; // 0.5% = 50 / 10000
    uint256 public constant MIN_DEPOSIT = 0.001 ether;

    event Deposit(address indexed from, uint256 amount, uint256 timestamp);
    event Withdrawal(address indexed merchant, uint256 amountReceived, uint256 feeTaken, uint256 timestamp);
    event MerchantAdded(address indexed merchant, address indexed owner);
    event MerchantRemoved(address indexed merchant, address indexed owner);
    event EmergencyWithdrawal(address indexed to, uint256 amount, uint256 timestamp);

    error BelowMinDeposit();
    error NotAuthorized();
    error InsufficientBalance();
    error ZeroAddress();
    error AlreadyMerchant();
    error NotMerchant();
    error FeeTransferFailed();
    error WithdrawTransferFailed();
    error TransferFailed();

    constructor(address _treasury) Ownable(msg.sender) {
        if (_treasury == address(0)) revert ZeroAddress();
        TREASURY = _treasury;
    }

    function deposit() external payable nonReentrant whenNotPaused {
        if (msg.value < MIN_DEPOSIT) revert BelowMinDeposit();
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    function withdraw(uint256 amount) external nonReentrant whenNotPaused {
        if (!isMerchant[msg.sender] && msg.sender != owner()) revert NotAuthorized();
        uint256 fee = (amount * PROTOCOL_FEE_BPS) / 10000;
        uint256 amountAfterFee = amount - fee;

        if (address(this).balance < amount) revert InsufficientBalance();

        (bool success1, ) = TREASURY.call{value: fee}("");
        if (!success1) revert FeeTransferFailed();

        (bool success2, ) = msg.sender.call{value: amountAfterFee}("");
        if (!success2) revert WithdrawTransferFailed();

        emit Withdrawal(msg.sender, amountAfterFee, fee, block.timestamp);
    }

    function addMerchant(address merchant) external onlyOwner {
        if (merchant == address(0)) revert ZeroAddress();
        if (isMerchant[merchant]) revert AlreadyMerchant();
        isMerchant[merchant] = true;
        emit MerchantAdded(merchant, msg.sender);
    }

    function removeMerchant(address merchant) external onlyOwner {
        if (!isMerchant[merchant]) revert NotMerchant();
        isMerchant[merchant] = false;
        emit MerchantRemoved(merchant, msg.sender);
    }

    function emergencyWithdraw(address to, uint256 amount) external onlyOwner {
        (bool success, ) = to.call{value: amount}("");
        if (!success) revert TransferFailed();
        emit EmergencyWithdrawal(to, amount, block.timestamp);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}