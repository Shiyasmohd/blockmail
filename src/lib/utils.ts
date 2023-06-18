import { Database } from "@tableland/sdk";
import { getDefaultProvider } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { Web3Storage, getFilesFromPath, File } from 'web3.storage'

const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY

const ethMainnetProvider = getDefaultProvider("https://mainnet.infura.io/v3/89d40c97f4bf44ceba600eeef7b57070");
export type Mail = {
    id: number;
    sender: string;
    recipient: string;
    subject: string;
    body: string;
    file: string;
}

const TABLE_NAME = 'blockmail_80001_7018'

export async function sendMail(sender: string, recipient: string, subject: string, body: string, file: any) {

    console.log({ sender, recipient, subject, body, file })
    // Insert a row into the table
    const db = new Database<Mail>();
    let id = generateRandomNumber()
    let recipientAddr = recipient
    if (recipient.includes('.eth')) {
        console.log('ens name fetching')
        recipientAddr = await getAddress(recipient) || recipient
        console.log('ens name fetched: ', recipientAddr)
    }
    let fileUrl = ""
    if (file) {
        fileUrl = await storeFiles(file)
        console.log({ fileUrl })
    }
    console.log({ recipientAddr })
    const { meta: insert } = await db
        .prepare(`INSERT INTO ${TABLE_NAME} (id, sender, recipient, subject, body, file) VALUES (?, ?, ?, ?, ?,?);`)
        .bind(id, sender, recipientAddr, subject, body, fileUrl)
        .run();
    console.log(insert.txn)

    // Wait for transaction finality
    await insert.txn?.wait();
    await sendNotification(recipientAddr, sender, subject)

    // Perform a read query, requesting all rows from the table
    const { results } = await db.prepare(`SELECT * FROM ${TABLE_NAME};`).all();
    console.log(results);
    return true
}

export async function getReceivedMail(recipient: string): Promise<Mail[]> {
    const db = new Database<Mail>();

    // Type is inferred due to `Database` instance definition.
    // Or, it can be identified in `prepare`.
    const { results } = await db.prepare<Mail>(`SELECT * FROM ${TABLE_NAME} WHERE recipient="${recipient}";`).all();
    console.log(results);
    return results
}
export async function getSentMail(sender: string): Promise<Mail[]> {
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

export function generateRandomNumber(): number {
    const min = 10000000; // Minimum 8-digit number (inclusive)
    const max = 99999999; // Maximum 8-digit number (inclusive)

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const shortWalletAddress = (address?: string) => {
    if (address) return address.slice(0, 5) + "..." + address.slice(-4,)
}

export const sendNotification = async (to: string, from: string, subject: string) => {

    const PK = process.env.NEXT_PUBLIC_PUSH_PRIVATE_KEY; // channel private key
    const Pkey = `0x${PK}`;
    const _signer = new ethers.Wallet(Pkey);

    try {

        console.log("sending notification to: ", to)
        const apiResponse = await PushAPI.payloads.sendNotification({
            signer: _signer,
            type: 1, // broadcast
            identityType: 2, // direct payload
            notification: {
                title: `New Mail recieved from ${shortWalletAddress(from)}`,
                body: `${subject}`
            },
            payload: {
                title: `New Mail recieved from ${shortWalletAddress(from)}`,
                body: `${subject}`,
                cta: '',
                img: ''
            },
            recipients: [to],
            channel: 'eip155:5:0x06C41df2358deD2Fd891522f9Da75eca2150c10B', // your channel address
            env: ENV.STAGING
        });
        console.log({ apiResponse })
    } catch (err) {
        console.error('Error: ', err);
    }
}
function getAccessToken() {
    // If you're just testing, you can paste in a token
    // and uncomment the following line:
    // return 'paste-your-token-here'

    // In a real app, it's better to read an access token from an
    // environement variable or other configuration that's kept outside of
    // your code base. For this to work, you need to set the
    // WEB3STORAGE_TOKEN environment variable before you run your code.
    return process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY as string
}

function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() })
}

export async function storeFiles(files: any) {
    console.log("uplaod started...")
    const client = makeStorageClient()
    const cid = await client.put(files)
    console.log('stored files with cid:', cid)
    return `https://ipfs.io/ipfs/${cid}`
}