import './globals.css'
import SessionWrapper from '@/components/SessionWrapper'

export const metadata = {
  title: 'CareerFlow',
  description: 'Intelligent Job Application Tracking Platform',
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