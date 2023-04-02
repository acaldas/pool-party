//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./IERC20.sol";

interface IPoolManager {
    function getOwner() external view returns (address);
}

contract BonusDistributor {

    // Bonus Pool Token
    address public immutable token;

    // Pool Manager
    address public poolManager;

    // Roll Over Percentage
    uint256 public rollOver = 90;

    // Can Call Take
    mapping ( address => bool ) public canTake;

    // Ownership modifier
    modifier onlyOwner() {
        require(msg.sender == IPoolManager(poolManager).getOwner(), 'Only Owner');
        _;
    }

    // Set owner to be able to take
    constructor(address token_, address poolManager_) {
        canTake[msg.sender]   = true;
        canTake[poolManager_] = true;
        token = token_;
        poolManager = poolManager_;
    }

    function setRollOver(uint newRollOver) external onlyOwner {
        require(newRollOver <= 100, 'Roll Over Out Of Bounds');
        rollOver = newRollOver;
    }

    // Set An Address To Call Take
    function setCanTake(address addr, bool canTake_) external onlyOwner {
        canTake[addr] = canTake_;
    }

    // Set Pool Manager Contract Address
    function setPoolManager(address newManager) external onlyOwner {
        poolManager = newManager;
    }

    function withdraw(address token_, uint amount) external onlyOwner {
        IERC20(token_).transfer(msg.sender, amount);
    }

    // Takes `amount` of tokens and sends to `to`
    function take(uint256 amount, address to) public {
        require(
            canTake[msg.sender],
            'Sender Cannot Take'
        );

        uint balance = IERC20(token).balanceOf(address(this));
        if (amount > balance) {
            amount = balance;
        }
        if (amount == 0) {
            return;
        }

        IERC20(token).transfer(to, amount);
    }

    function takeAll(address to) external returns (uint256){
        require(
            canTake[msg.sender],
            'Sender Cannot Take'
        );
        uint amount = amountToTake();
        take(amount, to);
        return amount;
    }

    function takeWithRollover(address to) external returns (uint256) {
        require(
            canTake[msg.sender],
            'Sender Cannot Take'
        );
        uint amount = amountToTakeWithRollOver();
        take(amount, to);
        return amount;
    }

    function amountToTake() public view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    function amountToTakeWithRollOver() public view returns (uint256) {
        uint bal = amountToTake();
        return ( bal * rollOver ) / 100;
    }
}