#!/usr/bin/env node

const { VennClient } = require('@vennbuild/venn-dapp-sdk');
const { ethers } = require("hardhat");
require('dotenv').config(); // Load environment variables

async function main() {
    const VENN_NODE_URL = process.env.VENN_NODE_URL; // Access environment variables
    const VENN_POLICY_ADDRESS = process.env.VENN_POLICY_ADDRESS;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;

    if (!VENN_NODE_URL || !VENN_POLICY_ADDRESS || !PRIVATE_KEY) {
        throw new Error("VENN_NODE_URL, VENN_POLICY_ADDRESS and PRIVATE_KEY must be defined in .env");
    }

    // Connect to the network using the URL
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL);

    // Create a wallet instance using the private key and provider
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // Get the signer's address from the wallet
    const signerAddress = wallet.address;

    const vennClient = new VennClient({ vennURL: VENN_NODE_URL, vennPolicyAddress: VENN_POLICY_ADDRESS });

    const soulBoundTest = new ethers.Contract("0xD9D33098fB6A54CB26dD5bBD7bEf03d92215c65c", ["function safeMint(address to, string memory uri)"], wallet);

    //Example transaction
    const tx = {
        from: signerAddress, // Use the signer's address
        to: "0x84c2D507920ce6f553dEe92eAa81f869E9c82267",
        value: ethers.parseEther("0.1").toString(), // Convert Ether to Wei
        data: soulBoundTest.interface.encodeFunctionData("safeMint", [signerAddress, "gateway.pinata.cloud/ipfs/bafkreialabmsuzygvkkedwsjrz5wq7np5onfnzn7ojg4l5awd2m6bipp7i"])
    };

    try {
        const approvedTransaction = await vennClient.approve(tx);

        // You can now send the approvedTransaction as you normally would
        const receipt = await wallet.sendTransaction(approvedTransaction);
        await receipt.wait();

        console.log("Transaction hash:", receipt.hash);
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
