const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LuckyListing", function () {
  let factory;
  let listing;
  let manager;
  let accounts;

  const listingProps = ["IPFS-Item-CID", ethers.utils.parseEther("6"), 3];

  beforeEach(async () => {
    [manager, ...accounts] = await ethers.getSigners();

    const LuckyListingFactory = await ethers.getContractFactory(
      "LuckyListingFactory",
      manager
    );

    factory = await LuckyListingFactory.deploy();
    await factory.deployed();

    await factory.publish(...listingProps, {
      value: ethers.utils.parseEther("6"),
    });
    const [address] = await factory.fetch();

    const LuckyListing = await ethers.getContractFactory(
      "LuckyListing",
      manager
    );

    listing = await new ethers.Contract(
      address,
      LuckyListing.interface,
      manager
    );
  });

  it("sets the factory contract caller as the manager of the newly published lucky-listing", async function () {
    const owner = await listing.owner();

    expect(owner).to.equal(manager.address);
  });

  it("allows multiple accounts to participate", async function () {
    // 6 ETH / 3 slots => 2 ETH entry (2 * (10 ** 18) => 2000000000000000000 wei)
    await expect(
      listing.connect(accounts[0]).enter({
        value: ethers.utils.parseEther("2"),
      })
    ).to.emit(listing, "Entered");

    await expect(
      listing.connect(accounts[1]).enter({
        value: ethers.utils.parseEther("2"),
      })
    ).to.emit(listing, "Entered");

    await expect(
      listing.connect(accounts[2]).enter({
        value: ethers.utils.parseEther("2"),
      })
    ).to.emit(listing, "Entered");
  });

  it("does not allow same account to participate multiple times", async function () {
    await listing.connect(accounts[0]).enter({
      value: ethers.utils.parseEther("2"),
    });

    await expect(
      listing.connect(accounts[0]).enter({
        value: ethers.utils.parseEther("2"),
      })
    ).to.be.revertedWith(
      `VM Exception while processing transaction: reverted with custom error 'ParticipationError("Already a participant")`
    );
  });

  it("does not allow more accounts to participate than the maximum number of avalable slots", async function () {
    await listing.connect(accounts[0]).enter({
      value: ethers.utils.parseEther("2"),
    });

    await listing.connect(accounts[1]).enter({
      value: ethers.utils.parseEther("2"),
    });

    await listing.connect(accounts[2]).enter({
      value: ethers.utils.parseEther("3.5"),
    });

    await expect(
      listing.connect(accounts[3]).enter({
        value: ethers.utils.parseEther("2"),
      })
    ).to.be.revertedWith(
      `VM Exception while processing transaction: reverted with custom error 'StatusError("Already passed the start")`
    );
  });

  it("select winner once the last slot gets filled", async function () {
    await listing.connect(accounts[0]).enter({
      value: ethers.utils.parseEther("2"),
    });

    await expect(
      listing.connect(accounts[1]).enter({
        value: ethers.utils.parseEther("2"),
      })
    ).not.to.emit(listing, "WinnerSelected");

    await expect(
      listing.connect(accounts[2]).enter({
        value: ethers.utils.parseEther("2"),
      })
    ).to.emit(listing, "WinnerSelected");
  });

  it("fails to enter when collateral is less that the min entry amount (price / slots)", async function () {
    await expect(
      listing.connect(accounts[0]).enter({
        value: ethers.utils.parseEther("1.99"),
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with custom error 'InsufficientCollateralError(\"Amount is not enough\")'"
    );
  });

  it("allows the owner to cancel and issue refunds to all participants", async function () {
    await listing.connect(accounts[0]).enter({
      value: ethers.utils.parseEther("2"),
    });

    await listing.connect(accounts[1]).enter({
      value: ethers.utils.parseEther("2"),
    });

    await expect(listing.cancel()).to.emit(listing, "Canceled");
  });

  // xit("releases the money to the winner and resets", async function () {
  //   await listing.connect(accounts[0]).enter({
  //     value: ethers.utils.parseEther("2"),
  //   });

  //   const initialBalance = await ethers.eth.getBalance(manager);

  //   await listing.pickWinner();

  //   const finalBalance = await web3.eth.getBalance(manager);
  //   const difference = finalBalance - initialBalance;

  //   assert(difference > web3.utils.toWei('1.8', 'ether'));

  //   const players = await listing.getParticipants()
  //   assert.equal([], players)
  // });
});
