import localFont from "next/font/local";
import "./globals.css";
import TopNavBar from "@/components/navbar/top-navbar/top-navbar";

const notoSansKR = localFont({
  src: [
    {
      path: "../../public/fonts/NotoSansKR-Thin.woff2",
      weight: "100",
      style: "normal"
    },
    {
      path: "../../public/fonts/NotoSansKR-Thin.woff",
      weight: "100",
      style: "normal"
    }
  ],
  variable: "--font-noto-sans-kr",
});

export const metadata = {
  title: "Superfantastic",
  description: "Generated by create next app",
	icons: {
		icon: "/svgs/superfantastic.svg",
	}
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={notoSansKR.variable}>				
        <TopNavBar />
        <main className="contents">
          {children}
        </main>	
      </body>
    </html>
  );
}
