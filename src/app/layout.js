import './globals.css'
import SessionWrapper from '@/components/SessionWrapper'

export const metadata = {
  title: 'CareerFlow',
  description: 'Find your next opportunity',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  )
}