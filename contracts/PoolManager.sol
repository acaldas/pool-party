//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./IERC20.sol";
import "./Ownable.sol";

interface IPool {
    function momentOfTruth() external;
    function token() external view returns (address);
    function valueInPool() external view returns (uint256);
    function givePoolTokenToLargestBuyers(uint256 amountEach, uint day) external;
    function depositBonusPoolToken(uint256 amount, uint day) external;
    function bonusDistributor() external view returns (address);
    function givePrizeTokensToOtherPools() external;
    function ticketsPurchasedForDay(uint day) external view returns (uint256);
}

interface IPriceOracle {
    function priceOfACCU() external view returns (uint256);
    function priceOfBNB() external view returns (uint256);
    function priceOfTRUTH() external view returns (uint256);
    function priceOf(address token) external view returns (uint256);
}

interface IBonusDistributor {
    function takeWithRollover(address to) external returns (uint256);
    function token() external view returns (address);
}

contract PoolManager is Ownable {

    // Price Oracles
    IPriceOracle public constant tokenOracle = IPriceOracle(0x184DBb100EE4763457d9Ee928a15e27Fc8963a99);
    IPriceOracle public constant BNBOracle = IPriceOracle(0x952B02F1973a1157cfE1B43d62aC6E1e921C5D00);

    // Tokens
    address private constant ACCU = 0x9cb949e8c256C3EA5395bbe883E6Ee6a20Db6045;
    address private constant TRUTH = 0x55a633B3FCe52144222e468a326105Aa617CC1cc;
    address private constant BUSD = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
    address private constant BNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;

    // Protocol Fee Receiver
    address public protocolFeeReceiver;

    // Governance To Call Moment Of Truth
    mapping ( address => bool ) public isAllowed;

    // List Of All Daily Pools
    address[] public pools;

    // counter for the current day, increments daily
    uint256 public currentDay;

    // percentage of bonus pool return that is split for everyone
    uint256 public bonusPoolPercentForEveryone = 70;

    // Fee For Protocol And Distributor
    uint256 public protocolFee;
    uint256 public distributorFee;

    constructor(
        address pool0_,
        address pool1_,
        address pool2_, 
        address protocolFeeReceiver_
    ) {

        // create pools array
        pools = new address[](3);
        pools[0] = pool0_;
        pools[1] = pool1_;
        pools[2] = pool2_;

        // set owner to be allowed to call momentOfTruth
        isAllowed[msg.sender] = true;

        // set protocol fee receiver
        protocolFeeReceiver = protocolFeeReceiver_;

        // set fees
        protocolFee = 9;
        distributorFee = 7;
    }

    function setProtocolFee(uint newFee) external onlyOwner {
        require(
            newFee + distributorFee <= 100, 'Fee Too High'
        );
        protocolFee = newFee;
    }

    function setDistributorFee(uint newFee) external onlyOwner {
        require(
            newFee + protocolFee <= 100, 'Fee Too High'
        );
        distributorFee = newFee;
    }

    function setProtocolFeeReceiver(address protocolFeeReceiver_) external onlyOwner {
        protocolFeeReceiver = protocolFeeReceiver_;
    }

    function setBonusPoolPercentForEveryone(uint newPercent) external onlyOwner {
        require(newPercent <= 100 && newPercent > 0, 'Percent Out Of Bounds');
        bonusPoolPercentForEveryone = newPercent;
    }

    /**
        Sets `pool` address at `index`
     */
    function setPool(uint index, address newPool) external onlyOwner {
        pools[index] = newPool;
    }

    /**
        Allows `user` to call momentOfTruth() or not
     */
    function setIsAllowed(address user, bool allowed) external onlyOwner {
        isAllowed[user] = allowed;
    }

    /**
        Withdraw's `amount` of `token` sending to address `to`
     */
    function withdraw(address token, uint256 amount, address to) external onlyOwner {
        IERC20(token).transfer(to, amount);
    }

    /**
        Ends The Day For The Protocol, Performing The Following Operations In Order:
            Loops Through All Pools To Determine The Pool With The Largest Value
            Takes The Bonus From The Corresponding Bonus Pool
            Distributes Tokens To The Three Largest Depositors In The Winning Pool
            Distribute Bonus Tokens To The Largest Pool's Participants
            Calls Moment Of Truth On Each Pool To Determine Their Rewards
            Increments The Current Day Variable `currentDay`
     */
    function momentOfTruth() external {
        require(
            isAllowed[msg.sender],
            'Only Allowed'
        );

        // value array of USD value in each pool
        uint len = pools.length;
        uint256[] memory values = new uint256[](pools.length);

        // tracking for pool with largest value
        uint256 largestValueIndex = 0;
        uint256 largestValue;

        // loop through all pools to determine the value in each and give rewards to other pools
        for (uint i = 0; i < len;) {
            values[i] = IPool(pools[i]).valueInPool();
            if (values[i] > largestValue) {
                largestValue = values[i];
                largestValueIndex = i;
            }
            IPool(pools[i]).givePrizeTokensToOtherPools();
            unchecked { ++i; }
        }

        // Set Bonus Distributor
        IBonusDistributor distributor = IBonusDistributor(IPool(pools[largestValueIndex]).bonusDistributor());

        // take bonus token to give out to winning pool
        distributor.takeWithRollover(address(this));

        // Fetch Pool Token From Distributor
        address token = distributor.token();

        // Fetch Balance
        uint256 tokenBalance = IERC20(token).balanceOf(address(this));
        uint256 forEveryone = ( tokenBalance * bonusPoolPercentForEveryone ) / 100; // make this a variable
        uint256 forLargestDepositors = tokenBalance - forEveryone;

        // approve of the largest pool to move ACCU
        IERC20(token).approve(pools[largestValueIndex], tokenBalance);

        // send bonus ACCU for all users of top pool to claim
        IPool(pools[largestValueIndex]).depositBonusPoolToken(forEveryone, currentDay);

        // give ACCU to the three largest buyers
        IPool(pools[largestValueIndex]).givePoolTokenToLargestBuyers(forLargestDepositors, currentDay);

        // loop through each pool, calling moment of truth, ending that day on each
        for (uint i = 0; i < len;) {
            IPool(pools[i]).momentOfTruth();
            unchecked { ++i; }
        }

        // increment day at the end of all the calls
        unchecked {
            currentDay++;
        }
    }

    function poolsToShareReward(address pool) external view returns (address, address) {
        if (pool == pools[0]) {
            return (pools[1], pools[2]);
        } else if (pool == pools[1]) {
            return (pools[0], pools[2]);
        } else if (pool == pools[2]) {
            return (pools[0], pools[1]);
        } else {
            return (address(0), address(0));
        }
    }

    function priceOfToken(address token) external view returns (uint256) {
        if (token == ACCU) {
            return priceOfACCU();
        } else if (token == TRUTH) {
            return priceOfTRUTH();
        } else if (token == BUSD) {
            return priceOfBUSD();
        } else if (token == BNB) {
            return priceOfBNB();
        } else {
            return BNBOracle.priceOf(token);
        }
    }

    function priceOfACCU() public view returns (uint256) {
        return tokenOracle.priceOfACCU();
    }

    function priceOfTRUTH() public view returns (uint256) {
        return tokenOracle.priceOfTRUTH();
    }

    function priceOfBNB() public view returns (uint256) {
        return BNBOracle.priceOfBNB();
    }

    function priceOfBUSD() public pure returns (uint256) {
        return 10**18;
    }
}