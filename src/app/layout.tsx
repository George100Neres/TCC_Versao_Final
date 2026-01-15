'use client'
import '@/app/globals.css'
import { usePathname } from 'next/navigation'
import Header from '@/shared/components/header'
import { UserProvider } from '@/shared/context/UserProvider'
import { routes } from '@/routes'

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode;
}>) {
  const pathRoot = usePathname()
  const routerPublic = Object.values(routes).filter((route) => route.public).map((route) => route.path)
  if (routerPublic.includes(pathRoot)) {
    return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    )
  } else {
    return (
      <html lang="en">
        <body className="max-w-[1440px] mx-auto">
          <UserProvider>
            <Header />
            {children}
          </UserProvider>
        </body>
      </html>
    )
  }
}
