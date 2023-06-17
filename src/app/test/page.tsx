'use client'
import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";

const tableName: string = "shiyas_80001_6994"; // Our pre-defined health check table

interface Mail {
    id: number;
    sender: string;
    recipient: string;
    subject: string;
    body: string;
}
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
        console.log(db)
    }

    const createData = async () => {
        // Default to grabbing a wallet connection in a browser
        const db = new Database<Mail>();

        // This is the table's `prefix`; a custom table value prefixed as part of the table's name
        const prefix: string = "shiyas";

        const { meta: create } = await db
            .prepare(`CREATE TABLE ${prefix} (id integer primary key, name text);`)
            .run();

        // The table's `name` is in the format `{prefix}_{chainId}_{tableId}`
        console.log(create.txn?.name); // e.g., my_sdk_table_80001_311
    }

    const readData = async () => {
        const db = new Database<Mail>();

        // Type is inferred due to `Database` instance definition.
        // Or, it can be identified in `prepare`.
        const { results } = await db.prepare<Mail>(`SELECT * FROM ${tableName};`).all();
        console.log(results);
    }

    const writeData = async () => {
        // Insert a row into the table
        const db = new Database<Mail>();

        const { meta: insert } = await db
            .prepare(`INSERT INTO ${tableName} (id, name) VALUES (?, ?);`)
            .bind(0, "Shiyas Tables")
            .run();

        // Wait for transaction finality
        await insert.txn?.wait();

        // Perform a read query, requesting all rows from the table
        const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
        console.log(results);
    }

    return (
        <div>
            <button onClick={handleClick}>
                Test
            </button>
            <br />
            <button onClick={createData}>
                Create
            </button>
            <br />
            <button onClick={readData}>
                Read
            </button>
            <br />
            <button onClick={writeData}>
                Write
            </button>
        </div>
    )
}