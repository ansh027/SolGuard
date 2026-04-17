import Providers from './Providers';
import MainnetWarning from './components/MainnetWarning';
import './globals.css';

export const metadata = {
  title: 'SolGuard — AI-Powered Solana Wallet Protection',
  description: 'Protect your Solana wallet with AI-powered transaction analysis, risk detection, and security scoring. Built with Claude AI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <MainnetWarning />
          {children}
        </Providers>
      </body>
    </html>
  );
}