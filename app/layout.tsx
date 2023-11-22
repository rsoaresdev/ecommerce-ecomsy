import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ecomsy • Dashboard',
  description: 'Controlo total sobre a sua loja. Gerir produtos, vendas, inventário e marketing de forma eficiente. Simplifique e impulsione o seu sucesso.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="pt">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>

  )
}
