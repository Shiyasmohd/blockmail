import { Database } from "@tableland/sdk";
import { getDefaultProvider } from "ethers";
const ethMainnetProvider = getDefaultProvider("https://mainnet.infura.io/v3/89d40c97f4bf44ceba600eeef7b57070");
type Mail = {
    id: number;
    sender: string;
    recipient: string;
    subject: string;
    body: string;
}

const TABLE_NAME = 'shiyas_80001_6998'

export async function sendMail(sender: string, recipient: string, subject: string, body: string) {

    // Insert a row into the table
    const db = new Database<Mail>();
    let id = generateRandomNumber()
    let recipientAddr = recipient
    if (recipient.includes('.eth')) {
        let recipientAddr = await getAddress(recipient)
    }
    const { meta: insert } = await db
        .prepare(`INSERT INTO ${TABLE_NAME} (id, sender, recipient, subject, body) VALUES (?, ?, ?, ?, ?);`)
        .bind(id, sender, recipientAddr, subject, body)
        .run();
    console.log(insert.txn)

    // Wait for transaction finality
    await insert.txn?.wait();

    // Perform a read query, requesting all rows from the table
    const { results } = await db.prepare(`SELECT * FROM ${TABLE_NAME};`).all();
    console.log(results);
    return true
}

export async function getUserMail(sender: string): Promise<Mail[]> {
    const db = new Database<Mail>();

    // Type is inferred due to `Database` instance definition.
    // Or, it can be identified in `prepare`.
    const { results } = await db.prepare<Mail>(`SELECT * FROM ${TABLE_NAME} WHERE sender="${sender}";`).all();
    console.log(results);
    return results
}

//to get the ENS name of an address
export const getEnsName = async (address: string) => {

    try {
        const name = await ethMainnetProvider.lookupAddress(address);
        return name;
    } catch (error) {
        console.error('Error occurred while looking up ENS name:', error);
        return null;
    }
};

// a function to find the address from ens name
export const getAddress = async (ensName: string) => {
    try {
        const address = await ethMainnetProvider.resolveName(ensName);
        return address;
    } catch (error) {
        console.error('Error occurred while looking up address:', error);
        return null;
    }
}

function generateRandomNumber(): number {
    const min = 10000000; // Minimum 8-digit number (inclusive)
    const max = 99999999; // Maximum 8-digit number (inclusive)

    return Math.floor(Math.random() * (max - min + 1)) + min;
}