
const { ethers } = require("hardhat");
const { vars } = require("hardhat/config");

async function main() {
    const KEY = vars.get("PRIVATE_KEY");
    const URL = vars.get("ENDPOINT");
    const ADDRESS = "0xcACa67b767Fa4F3A72a626bdB4591b5a629f1e68"

    // Provider and signer
    const provider = new ethers.providers.JsonRpcProvider(URL);
    const signer = new ethers.Wallet(KEY, provider);

    // Contract instance
    const SoulBoundTest = await ethers.getContractFactory("SoulBoundTest");
    const soulBoundTest = new ethers.Contract(ADDRESS, SoulBoundTest.interface, signer);

    // Parameters for safeMint
    const toAddress = signer.address; // Mint to the deployer's address
    const tokenURI = "gateway.pinata.cloud/ipfs/bafkreialabmsuzygvkkedwsjrz5wq7np5onfnzn7ojg4l5awd2m6bipp7i"; // Replace with your desired token URI

    try {
        // Call safeMint function
        console.log("Calling safeMint...");
        const tx = await soulBoundTest.safeMint(toAddress, tokenURI);
        await tx.wait();

        console.log(`Successfully minted SBT. Transaction hash: ${tx.hash}`);
    } catch (error) {
        console.error("Error minting SBT:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
