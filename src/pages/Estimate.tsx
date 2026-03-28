import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { AIEstimatorModal } from '@/components/AIEstimatorModal';

export default function Estimate() {
  // The modal opens automatically on this page
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-darkNavy text-white flex flex-col">
      <Helmet>
        <title>Free AI Project Estimate | Developers of Chicago</title>
        <meta name="description" content="Get an instant AI-powered project estimate for your custom web app, mobile app, ERP, or SaaS platform. Free quote from Developers of Chicago." />
        <link rel="canonical" href="https://www.developersofchicago.com/estimate" />
        <meta property="og:title" content="Free AI Project Estimate | Developers of Chicago" />
        <meta property="og:description" content="Describe your project and get an instant AI-powered cost estimate, timeline, and tech stack recommendation." />
        <meta property="og:url" content="https://www.developersofchicago.com/estimate" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />
      <main className="flex-grow" />
      <Footer />

      <AIEstimatorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
