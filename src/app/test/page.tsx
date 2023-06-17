import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";

const privateKey = "your_private_key";
const wallet = new Wallet(privateKey);
// To avoid connecting to the browser wallet (locally, port 8545).
// For example: "https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"
const provider = getDefaultProvider("http://127.0.0.1:8545");
const signer = wallet.connect(provider);
// Connect to the database
const db = new Database({ signer });
export default function Test() {


    const handleClick = async () => {

        const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY as string;
        console.log(privateKey)
        const wallet = new Wallet("acf02d3b8cbf9a1050e0d53763b98f0ea5857c6fd2b1d799d22d73744d2a2ccc");
        // To avoid connecting to the browser wallet (locally, port 8545).
        // For example: "https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"
        const provider = getDefaultProvider("https://rpc-mumbai.maticvigil.com/");
        const signer = wallet.connect(provider);
        // Connect to the database
        const db = new Database({ signer });
    }

    return (
        <div>
            <button onClick={handleClick}>
                Test
            </button>
        </div>
    )
}