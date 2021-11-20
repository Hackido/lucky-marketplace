# Lucky-Markteplace

- **Sellers** - actors that sell items, at a higher price or without offering a discount, they can convert items/cash into crypto or do arbitrage.
- **Buyers** - actors that buy items at a fraction of the listed price by risking their amount.
- **Carriers** - actors that participate in the delivery and verification process.
- **DAO** - 

Each party (Seller/Buyer/Carrier) must be motivation at each stage (listing status) to transition to the next and pay the gas costs. Every stage imposes different restrictions to each party. Every stage has a deadline that needs to be met.

### Stages(Statuses)
**1)** from **`INITIAL`** 

to **`STARTED`**
- `WHY:` seller wants to sell his item at full price or without discount + to unlock his collateral
- `HOW:` seller publishes new listing
- `GAS:` seller

---
**2)** from **`STARTED`**

to **`CANCELLED`**
- `WHY:` item is not available anymore, seller decides not to sell the item, does not want to accumulate additional costs canceling further in the process 
- `HOW:` listing is cancelled by the seller and refund of his collateral is issued, additional refunds might get issued to any participants (or availble to participants to ask for ???)
- `GAS:` seller (higher gas fee is paid for any additional refund that might get issued)

to **`WINNER SELECTED`**
- `WHY:` buyer wants to buy an item at a fraction of the price.
- `HOW:` last available slot is filled which activates the pick winner procedure
- `GAS:` buyer (higher gas fee is paid since there are more execution steps involved, for selecting a winner)

to **`WINNER SELECTED`**
- `WHY:` seller does not want to wait for all slots to get filled and it is happy with the current balance
- `HOW:` seller accepts the currently filled slots and balance which activates the pick winner procedure
- `GAS:` seller (higher gas fee is paid since there are more execution steps involved, for selecting a winner)

---
**3)** from **`WINNER SELECTED`**

to **`CANCELLED`**
- `WHY:` item is not available anymore, seller decides not to sell the item, does not want to accumulate additional costs canceling further in the process
- `HOW:` listing is cancelled by the seller and refund of his collateral is issued (additional refunds are issued or availble to participants to ask for ???)
`GAS:` seller

to **`SHIPPED`**
- `WHY:` seller wants get the current balance + unlock if his colateral
- `HOW:` seller provides prove that he has shipped the item
- `GAS:` seller

**TODO** - describe the shipment and confirmation updates

### Deadlines
- **`WINNER SELECT DEADLINE`** - once the listing is published, there is timeframe for participants to fill the slots or seller to initiate winner selection. After that timeframe, option to get a refund is available to each participant.
- **`SHIPMENT DEADLINE`** - once a winner is selected, there is a timeframe to ship the product. After that timeframe, option to get a refund is available to each participant.
- **`DELIVERY DEADLINE`** - once the product is shipped there is a timeframe to deliver it. After that timeframe, option to get a refund is available to each participant.
- **`APPROVAL DEADLINE`** - once the product is delivered with a proof, there is a timeframe for the winner to approve it. After that timeframe, option to get a refund is available to each participant.

**Examples:**

*Happy Path*
>1. Alice submits an item for sale (title, description, location, carrier, price, number of people that can participate, deadline to enter). Alice also needs to deposit some amount equal to the price she is willing to sell the item (prevents spam and malicious activities). After the sale she receives (price + deposited amount).
>2. People start depositing fractions of the listed price (item price / available positions) until all available positions are filled.
>3. Once all available positions are filled, a winner is selected at random.
>4. Let's say Bob is selected as a winner, he pays only a fraction of the listed price, but he will receive the item after Alice ships it. Alice will receive the total price (Bob's amount + other participants amounts)
>5. Once there is a prove (by tracking number) that Bob received the item, funds are released to Alice. (shipping by courier with mandatory inspection and test, to automatedly track the shipment to establish a successful delivery)

*Sad Path*
>1. Deadline is reached before all positions are filled. The sale is canceled and Alice covers any costs since it is her fault that the item listing is not attractive enough.
>2. Alice refuses to fulfill her obligation to ship the item. A penalty fee is deducted from her. Participants receive their deposited funds back.
>3. Alice does not provide the necessary proof of shipment within the pre-regulated period (it is a parameter for the conditions of the sale). The sale is canceled due to Alice's fault and a penalty fee is deducted from her. Participants receive their deposited funds back.
>4. Courier cannot deliver the product / Bob is not found and the package is returned to Alice. Participants receive their deposited funds back. (have to think about how the possible costs of are covered)
>5. Bob refuses the shipment and it is returned to Alice:
  Alice's fault (non-working, broken, missing parts, different from the description). Participants receive their deposited funds back. The sale is canceled due to Alice's fault and the corresponding penalty fee is deducted. To prove the truth of the claim, Bob must provide photo/video material. Judges might need to step in and help resolve the case.
  Bob's fault (doesn't want the product). Participants receive their deposited funds back. The sale is canceled due to Bob's fault and the respective penalty fee is deducted.
  The shipment is lost by the courier. The sale is canceled and participants receive their deposited funds back. (have to think about how the possible costs of are covered)
Each of the described cases can be identified via the API of the respective courier. Have to think about the conditions to break the contract in case one of the parties does not cooperate.

## Listing types & Features
- buy it now, 100% price, zero risk
- auction, discounted price, zero risk
- lucky sale, fraction of the price, risky
- black box, fraction of the price, highly risky

## Development
*prerequisites*

*back-end*

*front-end*

**Run**

**Tests**

**Deployment**

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.js
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```