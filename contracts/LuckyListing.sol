// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "./Errors.sol";
// import './libs/StringUtils.sol';


// GAS OPTIMIZATION
// - contract size, increases the cost of all interactions. break it down into separate contracts

// SECURITY
// add circuit breaker

contract LuckyListing is Ownable {
    enum Status {
        Canceled,
        Started,
        WinnerSelected,
        Shipped,
        Delivered,
        NotAsDescribed,
        NotDeliverable
    }

    struct Item {
        // TODO better use bytes32 instead of string for the CID
        // string cidImg; // image hash
        string cid; // content hash (title, description)
    }

    Item private item;
    Status private status;
    uint256 private constant MAX_DAYS_TO_NEXT_STAGE = 3 minutes; // TODO revert it
    uint256 private immutable entryAmount;
    uint256 private randNonce = 0;
    uint256 private updatedAt;
    uint256 private price;
    uint256 private maxSlots;
    uint256 private collateralBalance;
    mapping(address => uint256) private participantsBalances;
    address[] private participants;
    address private winner;

    event Canceled(address indexed adr);
    event Started(address indexed adr);
    event Entered(address indexed adr);
    event WinnerSelected(address indexed adr);
    event Refunded(address indexed adr);

    modifier whenSlotsFilled() {
        if (participants.length < maxSlots) {
            revert SlotsError("All slots must be filled");
        }
        _;
    }

    modifier whenAvailableSlots() {
        if (participants.length == maxSlots) {
            revert SlotsError("No available slots");
        }
        _;
    }

    modifier notOwner() {
        if (msg.sender == owner()) {
            revert AuthorizationError("Owner is not allowed");
        }
        _;
    }

    modifier activeParticipant() {
        if (participantsBalances[msg.sender] == 0) {
            revert ParticipationError(
                "Not a participant or refunded"
            );
        }
        _;
    }

    modifier inactiveParticipant() {
        if (participantsBalances[msg.sender] > 0) {
            revert ParticipationError("Already a participant");
        }
        _;
    }

    modifier whenDeadlineIsMissed() {
        if (!_afterDeadline(MAX_DAYS_TO_NEXT_STAGE)) {
            revert DeadlineError("Deadline is not reached");
        }
        _;
    }

    modifier whenDeadlineIsMet() {
        if (!_beforeDeadline(MAX_DAYS_TO_NEXT_STAGE)) {
            revert DeadlineError("Deadline is missed");
        }
        _;
    }

    modifier whenStarted() {
        if (status != Status.Started) {
            revert StatusError("Already passed the start");
        }
        _;
    }

    modifier whenNotCanceled() {
        if (status == Status.Canceled) {
            revert StatusError("It is already cancelled");
        }
        _;
    }

    fallback() external payable {
        // address(this).balance += msg.value;
    }

    receive() external payable {}

    constructor(
        address _manager,
        string memory _productCid,
        uint256 _price,
        uint256 _maxSlots
    ) payable {
        // TODO better validation require(_productCid.notEqual(""));

        if (_maxSlots <= 0) {
            revert InitializationError("Slots should be greater than 0");
        }

        if (_price <= 0) {
            revert InitializationError("Price should be greater than 0");
        }

        uint amount = msg.value;
        if (amount < _price) {
            revert InsufficientCollateralError("Amount is not enough");
        }

        uint256 change = amount - _price;
        if (change > 0) {
            amount -= change;
        }

        _transferOwnership(_manager);

        // cheaper instead initializing it with a constructor
        item.cid = _productCid;

        maxSlots = _maxSlots;
        price = _price;
        collateralBalance = amount;
        entryAmount = _price / maxSlots;
        status = Status.Started;
        updatedAt = block.timestamp;

        if (change > 0) {
            payable(msg.sender).transfer(change);
        }

        emit Started(address(this));
    }

    function cancel() external onlyOwner whenNotCanceled {
        status = Status.Canceled;
        updatedAt = block.timestamp;
        uint256 collateralToWithdraw = collateralBalance;
        collateralBalance = 0;

        // mapping (address => uint256) balancesInMemory = participantsBalances;

        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            uint256 amount = participantsBalances[participant];
            participantsBalances[participant] = 0;

            // console.log("Refund issued:", participant);
            emit Refunded(participant);

            payable(participant).transfer(amount);
        }

        payable(owner()).transfer(collateralToWithdraw);

        emit Canceled(address(this));
    }

    function enter()
        external
        payable
        notOwner
        inactiveParticipant
        whenStarted
        whenDeadlineIsMet
        whenAvailableSlots
    {
        uint256 amount = msg.value;
        if (amount < entryAmount) {
            revert InsufficientCollateralError("Amount is not enough");
        }

        uint256 change = amount - entryAmount;
        if (change > 0) {
            amount -= change;
        }
        participantsBalances[msg.sender] = entryAmount;
        participants.push(msg.sender);
        updatedAt = block.timestamp;

        if (change > 0) {
            payable(msg.sender).transfer(change);
        }

        emit Entered(msg.sender);

        if (participants.length == maxSlots) {
            selectWinner();
        }
    }

    function selectWinner()
        public
        whenStarted
        whenSlotsFilled
        whenDeadlineIsMet
    {
        uint256 index = _random() % participants.length;
        winner = participants[index];
        status = Status.WinnerSelected;
        updatedAt = block.timestamp;

        emit WinnerSelected(winner);
    }

    function getRefund() external activeParticipant whenDeadlineIsMissed {
        uint256 amount = participantsBalances[msg.sender];
        participantsBalances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit Refunded(msg.sender);
    }

    function getCollateralRefund() external onlyOwner whenDeadlineIsMissed {
        uint256 amount = collateralBalance;
        collateralBalance = 0;
        payable(msg.sender).transfer(amount);
    }

    function getParticipants() external view returns (address[] memory) {
        return participants;
    }

    function fetchDetails()
        external
        view
        returns (
            address,
            Item memory,
            string memory,
            uint256,
            uint256,
            uint256,
            address[] memory,
            address,
            uint256,
            uint256,
            Status,
            uint256
        )
    {
        return (
            owner(),
            item,
            "TMP_LOCATION",
            price,
            maxSlots,
            entryAmount,
            participants,
            winner,
            collateralBalance,
            address(this).balance,
            status,
            updatedAt
        );
    }

    function _releaseFunds() private {
        payable(owner()).transfer(address(this).balance);
        // participants = new address[](0);
        // participantsBalances;
    }

    function _afterDeadline(uint256 deadline) private view returns (bool) {
        return block.timestamp - updatedAt > deadline;
    }

    function _beforeDeadline(uint256 deadline) private view returns (bool) {
        return block.timestamp - updatedAt <= deadline;
    }

    function _random() private returns (uint256) {
        // TODO use trully random number (Chainlink's VRF)
        randNonce++;
        return
            uint256(
                keccak256(
                    abi.encode(
                        randNonce,
                        block.timestamp,
                        block.difficulty,
                        owner(),
                        participants
                    )
                )
            );
    }
}
