import { Database } from "@tableland/sdk";

type Mail = {
    id: number;
    sender: string;
    recipient: string;
    subject: string;
    body: string;
}

const TABLE_NAME = 'shiyas_80001_6998'

export async function sendMail(id: number, sender: string, recipient: string, subject: string, body: string) {
    // Insert a row into the table
    const db = new Database<Mail>();

    const { meta: insert } = await db
        .prepare(`INSERT INTO ${TABLE_NAME} (id, sender, recipient, subject, body) VALUES (?, ?, ?, ?, ?);`)
        .bind(id, sender, recipient, subject, body)
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