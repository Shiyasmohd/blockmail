"use client"
import { getSentMail } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { Mail } from "@/lib/utils";

export default function Sent() {
    const account = useAccount();
    const [mails, setMails] = useState<Mail[]>([]);

    useEffect(() => {
        (async () => {
            try {
                if (account.address !== undefined) {
                    console.log(
                        "account.address", account.address
                    );

                    const mails = await getSentMail(account.address);
                    if (mails) {
                        setMails(mails);
                        console.log("mails", mails);
                    }
                }
            } catch (error) {
                console.error("Error occurred while fetching mails:", error);
            }
        })();
    }, []);

    return (
        <>
            {mails.length !== 0 ? (
                <main className="bg-slate-200 h-screen">
                    {mails.map((mail, index) => (
                        <div
                            key={index}
                            className="bg-[#f6f8fc] hover:bg-[white] cursor-pointer"
                        >
                            <div className="flex p-4">
                                <div className="font-bold px-5">{mail.from}</div>
                                <div className="px-5">{mail.subject}</div>
                            </div>
                            <hr className="border-t-2 border-gray-300" />
                        </div>
                    ))}
                </main>
            ) : (
                <div className="flex justify-center items-center h-screen">
                    No mails
                </div>
            )}
        </>
    );
}
