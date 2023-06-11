'use client'
import { Inter } from 'next/font/google'
import { Divider } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="flex justify-center items-center h-screen">
      <Divider height='40px'/>
    </main>
  )
}
