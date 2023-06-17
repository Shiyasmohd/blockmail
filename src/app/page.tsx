'use client'
import { Inter } from 'next/font/google'
import { Divider } from '@chakra-ui/react'
import mailInbox from '@/components/email/email'

const inter = Inter({ subsets: ['latin'] })

const mails = [
  {
    from: 'Ahamed Zain',
    subject: 'Hello',
  },
  {
    from: 'Ahamed Zain',
    subject: 'Hello sjsjbxjhbxiqbwxkjqwnkx',
  },
  
];

export default function Home() {
  return (
    <main className=" bg-slate-200 h-screen">
      {mails.map((mail, index) => (
        <div className='bg-[#f6f8fc] hover:bg-[white] cursor-pointer'>
          <div className='flex p-4'>
            <div className="font-bold px-5">
              {mail.from}
            </div>
            <div className='px-5'>{mail.subject}</div>
          </div>
          <hr className='border-t-2 border-gray-300' />
        </div>
      ))}
      
    </main>
  )
}
