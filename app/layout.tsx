import type { Metadata } from "next"
import { Zen_Maru_Gothic } from "next/font/google"
import { Provider } from "./components/ui/provider"

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-zen-maru",
})

export const metadata: Metadata = {
  title: "タイムアタッククイズ大会",
  description: "グループ対抗のタイムアタッククイズゲーム",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={zenMaruGothic.variable}>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
