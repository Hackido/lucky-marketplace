const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LuckyListingFactory", function () {
  let factory;
  let manager;

  const listingProps = ["IPFS-Item-CID", ethers.utils.parseEther("6"), 3];

  beforeEach(async () => {
    [manager] = await ethers.getSigners();

    const LuckyListingFactory = await ethers.getContractFactory(
      "LuckyListingFactory",
      manager
    );

    factory = await LuckyListingFactory.deploy();
    await factory.deployed();
  });

  it("publishes new lucky-listing by providing enough collateral", async function () {
    await expect(
      factory.publish(...listingProps, {
        value: ethers.utils.parseEther("6"),
      })
    ).to.emit(factory, "Published");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    // await setGreetingTx.wait();
  });

  it("fetches the deployed lucky-listings", async function () {
    factory.publish(...listingProps, { value: ethers.utils.parseEther("6") });
    const listingAddresses = await factory.fetch();
    expect(listingAddresses.length).to.equal(1);
  });

  it("fails to publish new lucky-listing by not providing enough collateral", async function () {
    await expect(
      factory.publish(...listingProps, {
        value: ethers.utils.parseEther("1.99"),
      })
    ).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with custom error 'InsufficientCollateralError(\"Amount is not enough\")'"
    );
  });
});
