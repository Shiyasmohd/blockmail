'use client'
import { sendNotification, storeFiles } from "@/lib/utils";
import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";

const tableName: string = "blockmail_80001_7018"; // Our pre-defined health check table

interface Mail {
    id: number;
    sender: string;
    recipient: string;
    subject: string;
    body: string;
    file: string
}
export default function Test() {


    const createData = async () => {
        // Default to grabbing a wallet connection in a browser
        const db = new Database<Mail>();

        // This is the table's `prefix`; a custom table value prefixed as part of the table's name
        const prefix: string = "blockmail";

        const { meta: create } = await db
            .prepare(`CREATE TABLE ${prefix} (id integer primary key, sender text, recipient text, subject text, body text,file text);`)
            .run();

        // The table's `name` is in the format `{prefix}_{chainId}_{tableId}`
        console.log(create.txn?.name); // e.g., my_sdk_table_80001_311
    }

    const readData = async () => {
        const db = new Database<Mail>();

        // Type is inferred due to `Database` instance definition.
        // Or, it can be identified in `prepare`.
        // const { results } = await db.prepare<Mail>(`SELECT * FROM ${tableName};`).all();
        const { results } = await db.prepare<Mail>(`SELECT * FROM ${tableName};`).all();

        console.log(results);
    }

    const writeData = async () => {
        // Insert a row into the table
        const db = new Database<Mail>();

        const { meta: insert } = await db
            .prepare(`INSERT INTO ${tableName} (id, sender, recipient, subject, body, file) VALUES (?, ?, ?, ?, ?, ?);`)
            .bind(74484218, "0x379AB0b69d7fbB5834741543245836Dd2B3E7C8A", "0x06C41df2358deD2Fd891522f9Da75eca2150c10B", "Web3 is Future", "Web3 is a decentralized network", "")
            .run();
        console.log(insert.txn)

        // Wait for transaction finality
        await insert.txn?.wait();

        // Perform a read query, requesting all rows from the table
        const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
        console.log(results);
    }

    return (
        <div>
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
            <br />
            <button onClick={() => sendNotification("0xB90581917BCFeb7A0e8511c8Cb7bC137F7541fb7", "0x06C41df2358deD2Fd891522f9Da75eca2150c10B", "New")}>
                Send Notification
            </button>
            <input type='file' onChange={(e) => storeFiles(e.target.files)} />
            <button onClick={() => storeFiles}>
                Upload
            </button>
        </div>
    )
}