//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./IERC20.sol";

interface IPoolManager {
    function currentDay() external view returns (uint256);
    function getOwner() external view returns (address);
    function protocolFeeReceiver() external view returns (address);
    function protocolFee() external view returns (uint256);
    function distributorFee() external view returns (uint256);
    function poolsToShareReward(address pool) external view returns (address, address);
    function priceOfToken(address token) external view returns (uint256);
}

interface IDailyPool {
    function depositReward(address rewardToken, uint256 amount, uint256 day) external; 
}

contract DailyPool {

    // Pool Manager
    address public poolManager;

    // Bonus Distributor
    address public bonusDistributor;

    // Main Token and both Reward Tokens
    address public immutable token;
    address public immutable rewardToken0;
    address public immutable rewardToken1;

    // Precision Value To Avoid Roundoff Error
    uint256 private constant precision = 10**18;

    // Total Rewards For Both Reward Tokens
    uint256 public totalRewards0;
    uint256 public totalRewards1;
    uint256 public totalBonusPoolToken;

    // Largest Purchase Structure
    struct LargePurchase {
        uint256 amount;
        address user;
    }

    // UserInfo
    struct UserInfo {
        uint256 dailyTickets;
        bool hasClaimed;
    }

    // Day Structure
    struct Day {

        // is the day over
        bool dayOver;

        // reward tracking
        uint256 totalRewards0;
        uint256 totalRewards1;
        uint256 dividendPerShare0;
        uint256 dividendPerShare1;

        // bonus Pool Token from winning
        uint256 totalBonusPoolToken;
        uint256 dividendPerSharePoolToken;

        // total tickets purchased today
        uint256 totalTickets;

        // First, Second, and Third largest depositor of the day
        LargePurchase largest;
        LargePurchase secondLargest;
        LargePurchase thirdLargest;

        // Tokens For This Day To Be Won By Other Pools
        uint256 prizeTokens;

        // User Info
        mapping ( address => UserInfo ) userInfo;
    }

    // Maps a day index to a Day
    mapping ( uint256 => Day ) public dayInfo;

    // Total Tickets Purchased Overall Since Inception
    uint256 public nTicketsTotal;

    // Ownership modifier
    modifier onlyOwner() {
        require(msg.sender == IPoolManager(poolManager).getOwner(), 'Only Owner');
        _;
    }

    constructor(address token_, address reward0, address reward1, address bonusDistributor_, address poolManager_) {
        token = token_;
        rewardToken0 = reward0;
        rewardToken1 = reward1;
        bonusDistributor = bonusDistributor_;
        poolManager = poolManager_;
    }
    
    function setPoolManager(address newManager) external onlyOwner {
        poolManager = newManager;
    }

    function setBonusDistributor(address newDistributor) external onlyOwner {
        bonusDistributor = newDistributor;
    }

    function withdraw(address token_, uint256 amount, address to) external onlyOwner {
        IERC20(token_).transfer(to, amount);
    }

    function buyTickets(uint256 amount) external {
        
        // tickets received
        uint256 received = _transferIn(token, amount);

        // add to tickets received for the day
        uint256 today = currentDay();
        unchecked {
            nTicketsTotal += received;
            dayInfo[today].totalTickets += received;
            dayInfo[today].userInfo[msg.sender].dailyTickets += received;
        }

        // check if total purchased became one of the largest tickets
        uint256 totalPurchased = dayInfo[today].userInfo[msg.sender].dailyTickets;
        if (totalPurchased > dayInfo[today].largest.amount) {
            dayInfo[today].largest.amount = totalPurchased;
            dayInfo[today].largest.user = msg.sender;
        } else if (totalPurchased > dayInfo[today].secondLargest.amount) {
            dayInfo[today].secondLargest.amount = totalPurchased;
            dayInfo[today].secondLargest.user = msg.sender;
        } else if (totalPurchased > dayInfo[today].thirdLargest.amount) {
            dayInfo[today].thirdLargest.amount = totalPurchased;
            dayInfo[today].thirdLargest.user = msg.sender;
        }

        // split tokens received across next seven days, protocol fee receiver, and bonus pool
        uint protocolFee = IPoolManager(poolManager).protocolFee();
        uint distributorFee = IPoolManager(poolManager).distributorFee();

        // split into three amounts
        uint pAmount = ( received * protocolFee ) / 100;
        uint dAmount = ( received * distributorFee ) / 100;
        uint remainder = received - ( pAmount + dAmount );

        // send to destinations
        _send(token, IPoolManager(poolManager).protocolFeeReceiver(), pAmount);
        _send(token, bonusDistributor, dAmount);

        // split remainder into 7 pieces for the following 7 days
        uint256 amountForEachDay = remainder / 7;
        for (uint i = 1; i <= 7; i++) {
            dayInfo[today + i].prizeTokens += amountForEachDay;
        }
    }

    function depositReward(address rewardToken, uint256 amount, uint256 day) external {

        // ensure we only take reward tokens
        if (rewardToken == rewardToken0 || rewardToken == rewardToken1) {
            
            // transfer in reward token, noting amount received
            uint received = _transferIn(rewardToken, amount);

            // determine which reward token we received
            if (rewardToken == rewardToken0) {
                unchecked {
                    dayInfo[day].totalRewards0 += received;
                    totalRewards0 += received;
                }
            } else {
                unchecked {
                    dayInfo[day].totalRewards1 += received;
                    totalRewards1 += received;
                }
            }
        }
    }

    function depositBonusPoolToken(uint256 amount, uint256 day) external {
        if (day > currentDay()) {
            return; // something went wrong
        }

        // return out if there are not rewards for people
        if (amount == 0) {
            return;
        }

        // transfer in pool token
        uint256 received = _transferIn(token, amount);

        // deposits bonus pool token to the pool for users to share
        unchecked {
            dayInfo[day].totalBonusPoolToken += received;
            totalBonusPoolToken += received;
        }
    }

    /**
        Sends Pool Token To The Three Largest Buyers For The Specified `Day`
     */
    function givePoolTokenToLargestBuyers(uint256 amountTotal, uint day) external {
        if (day > currentDay()) {
            return;
        }

        // calculate amount each
        uint256 amountEach = amountTotal / 3;

        // return out if there are not rewards for everyone
        if (amountEach == 0) {
            return;
        }

        // send Token from manager to the three largest depositors
        _sendPoolTokenFrom(msg.sender, dayInfo[day].largest.user, amountEach);
        _sendPoolTokenFrom(msg.sender, dayInfo[day].secondLargest.user, amountEach);
        _sendPoolTokenFrom(msg.sender, dayInfo[day].thirdLargest.user, amountEach);
    }

    function givePrizeTokensToOtherPools() external {
        require(msg.sender == poolManager, 'Only Pool Manager');

        // today
        uint256 today = currentDay();

        // fetch prize tokens to give out
        uint256 prizeTokens = dayInfo[today].prizeTokens;

        // fetch two pools to receive rewards
        (address pool0, address pool1) = IPoolManager(poolManager).poolsToShareReward(address(this));

        // split prize tokens in half for each pool
        uint256 forPool0 = prizeTokens / 2;
        uint256 forPool1 = prizeTokens - forPool0;

        // approve each pool for their amount
        IERC20(token).approve(pool0, forPool0);
        IERC20(token).approve(pool1, forPool1);

        // deposit rewards into each pool
        IDailyPool(pool0).depositReward(token, forPool0, today);
        IDailyPool(pool1).depositReward(token, forPool1, today);
    }

    function momentOfTruth() external {
        require(msg.sender == poolManager, 'Only Pool Manager');

        // set rewards for each token
        uint today = currentDay();
        if (dayInfo[today].totalTickets > 0) {
            dayInfo[today].dividendPerShare0 = ( dayInfo[today].totalRewards0 * precision ) / dayInfo[today].totalTickets;
            dayInfo[today].dividendPerShare1 = ( dayInfo[today].totalRewards1 * precision ) / dayInfo[today].totalTickets;
            dayInfo[today].dividendPerSharePoolToken = ( dayInfo[today].totalBonusPoolToken * precision ) / dayInfo[today].totalTickets;
        }

        // set day as over
        dayInfo[today].dayOver = true;
    }

    function addToPrizeTokens(uint256 day, uint256 amount) external {
        require(
            day <= currentDay(),
            'Cannot Add To Previous Prize Tokens'
        );
        uint received = _transferIn(token, amount);
        dayInfo[day].prizeTokens += received;
    }

    function claimRewards(uint256 day) external {
        require(
            dayInfo[day].dayOver, 'Day Is Not Over'
        );
        require(
            dayInfo[day].userInfo[msg.sender].dailyTickets > 0,
            'Zero Tickets'
        );
        require(
            dayInfo[day].userInfo[msg.sender].hasClaimed == false,
            'User Has Already Claimed'
        );

        // determine reward amounts
        (uint amount0, uint amount1, uint amount2) = pendingRewards(msg.sender, day);

        // toggle claim
        dayInfo[day].userInfo[msg.sender].hasClaimed = true;

        // send reward to user
        _send(rewardToken0, msg.sender, amount0);
        _send(rewardToken1, msg.sender, amount1);
        _send(token, msg.sender, amount2);
    }

    function _transferIn(address token_, uint256 amount) internal returns (uint256 received) {
        require(
            IERC20(token_).allowance(msg.sender, address(this)) >= amount,
            'Insufficient Allowance'
        );
        require(
            IERC20(token_).balanceOf(msg.sender) >= amount,
            'Insufficient Balance'
        );

        uint256 before = IERC20(token_).balanceOf(address(this));
        IERC20(token_).transferFrom(msg.sender, address(this), amount);
        uint256 After = IERC20(token_).balanceOf(address(this));
        require(After > before, 'Something Went Wrong');
        unchecked {
            received = After - before;
        }
    }

    function _send(address token_, address to, uint256 amount) internal {
        
        if (to == address(0) || amount == 0) {
            return;
        }

        uint balance = IERC20(token_).balanceOf(address(this));
        if (amount > balance) {
            amount = balance;
        }

        if (amount == 0) {
            return;
        }

        require(
            IERC20(token_).transfer(to, amount),
            'Error Transferring Token'
        );
    }

    function _sendPoolTokenFrom(address from, address to, uint256 amount) internal {
        if (to == address(0) || amount == 0 || from == address(this) || to == address(this)) {
            return;
        }

        IERC20(token).transferFrom(from, to, amount);
    }

    function pendingRewards(address user, uint256 day) public view returns (uint256 amount0, uint256 amount1, uint256 amount2) {
        if (dayInfo[day].userInfo[user].hasClaimed) {
            return (0, 0, 0);
        }
        amount0 = ( dayInfo[day].userInfo[user].dailyTickets * dayInfo[day].dividendPerShare0 ) / precision;
        amount1 = ( dayInfo[day].userInfo[user].dailyTickets * dayInfo[day].dividendPerShare1 ) / precision;
        amount2 = ( dayInfo[day].userInfo[user].dailyTickets * dayInfo[day].dividendPerSharePoolToken ) / precision;
    }

    function todaysTickets() external view returns (uint256) {
        return dayInfo[currentDay()].totalTickets;
    }

    function ticketsPurchasedForDay(uint day) external view returns (uint256) {
        return dayInfo[day].totalTickets;
    }

    function currentDay() public view returns (uint256) {
        return IPoolManager(poolManager).currentDay();
    }
    
    function getUsersTicketForDay(address user, uint day) external view returns (uint256) {
        return dayInfo[day].userInfo[user].dailyTickets;
    }

    function getUsersTicketsToday(address user) external view returns (uint256) {
        return dayInfo[currentDay()].userInfo[user].dailyTickets;
    }

    function largestTicket(uint today) public view returns (uint256, address) {
        return (dayInfo[today].largest.amount, dayInfo[today].largest.user);
    }

    function secondLargestTicket(uint today) public view returns (uint256, address) {
        return (dayInfo[today].secondLargest.amount, dayInfo[today].secondLargest.user);
    }

    function thirdLargestTicket(uint today) public view returns (uint256, address) {
        return (dayInfo[today].thirdLargest.amount, dayInfo[today].thirdLargest.user);
    }

    function todaysLargestTicket() public view returns (uint256, address) {
        uint today = currentDay();
        return (dayInfo[today].largest.amount, dayInfo[today].largest.user);
    }

    function todaysSecondLargestTicket() public view returns (uint256, address) {
        uint today = currentDay();
        return (dayInfo[today].secondLargest.amount, dayInfo[today].secondLargest.user);
    }

    function todaysThirdLargestTicket() public view returns (uint256, address) {
        uint today = currentDay();
        return (dayInfo[today].thirdLargest.amount, dayInfo[today].thirdLargest.user);
    }

    function valueInPool() public view returns (uint256) {
        return dayInfo[currentDay()].totalTickets * IPoolManager(poolManager).priceOfToken(token);
    }

    function getPrizeTokens(uint day) public view returns (uint256) {
        return dayInfo[day].prizeTokens;
    }

    function getTodaysPrizeTokens() public view returns (uint256) {
        return dayInfo[currentDay()].prizeTokens;
    }

    function pendingRewardsRange(address user, uint startDay, uint endDay) external view returns (uint256[] memory, uint256[] memory, uint256[] memory) {

        uint len = endDay - startDay;
        uint256[] memory amount0s = new uint256[](len);
        uint256[] memory amount1s = new uint256[](len);
        uint256[] memory amount2s = new uint256[](len);

        uint count = 0;
        for (uint i = startDay; i < endDay;) {
            (
                amount0s[count],
                amount1s[count],
                amount2s[count]
            ) = pendingRewards(user, i);
            unchecked { ++count; ++i; }
        }
        return(amount0s, amount1s, amount2s);
    }
}