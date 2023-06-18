"use client"
import { getReceivedMail } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Mail } from "@/lib/utils";
import ModalComponent from "@/components/model/mailModel";
import { Flex, Text } from "@chakra-ui/react";
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

          const mails = await getReceivedMail(account.address);
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

  const tempMails = [
    {
      from: "example1@example.com",
      subject: "Hello",
      body: "Hi, how are you?",
    },
    {
      from: "example2@example.com",
      subject: "Test Email",
      body: "This is a test email.",
    },
    {
      from: "example3@example.com",
      subject: "Meeting Reminder",
      body: "Just a reminder about the meeting tomorrow.",
    },
    {
      from: "example4@example.com",
      subject: "Important Announcement",
      body: "Please read the attached announcement carefully.",
    },
    {
      from: "example5@example.com",
      subject: "New Product Launch",
      body: "Introducing our latest product. Check it out!",
    },
    {
      from: "example6@example.com",
      subject: "Vacation Plans",
      body: "I will be on vacation next week. See you when I return!",
    },
  ];

  return (
    <>
      {account.isConnected === true ? (
        <>
          {mails.length !== 0 ? (
            <main className="bg-slate-200 h-screen">
              {mails.map((mail, index) => (
                <ModalComponent mail={mail} address={mail.sender} key={index} header={'Inbox'} />
              ))}
            </main>
          ) : (
            <div className=" bg-slate-200 flex justify-center items-center h-screen">
              No mails
            </div>
          )}
        </>
      ) : (
        <>
          <Flex align="center" justifyContent={'center'} className="bg-slate-200 h-screen">
            <Text fontSize="base">Please connect your wallet</Text>
          </Flex>
        </>
      )}
    </>
  );
}
