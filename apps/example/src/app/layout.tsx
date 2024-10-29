import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Create Next Oauth Demo App',
  description: 'power by: nextjs.boy ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>{children}</body>
    </html>
  )
}
