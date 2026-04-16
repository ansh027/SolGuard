'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      router.push('/dashboard');
    }
  }, [connected, router]);

  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}