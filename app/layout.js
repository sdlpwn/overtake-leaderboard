import './globals.css'; // ← 이 줄 추가해야 Tailwind 작동합니다

export const metadata = {
  title: 'OVERTAKE Yapping Leaderboard',
  description: "See who's yapping the loudest in the Web3 community. Powered by KaitoAI & OVERTAKE.",
  openGraph: {
    title: 'OVERTAKE Yapping Leaderboard',
    description: 'Track the most active KOLs in the OVERTAKE ecosystem.',
    url: 'https://overtake-leaderboard.vercel.app',
    siteName: 'OVERTAKE Yapping Leaderboard',
    images: [
      {
        url: 'https://overtake-leaderboard.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OVERTAKE Yapping Leaderboard',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OVERTAKE Yapping Leaderboard',
    description: "See who's yapping the loudest in the Web3 community.",
    images: ['https://overtake-leaderboard.vercel.app/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}