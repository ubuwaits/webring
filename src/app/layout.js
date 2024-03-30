import './globals.css'

export const metadata = {
  title: 'Merveilles Webring RSS',
  description: 'RSS feeds from Merveilles Webring',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
