import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowLeft, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-darkNavy text-white flex flex-col">
      <Helmet>
        <title>Page Not Found | DC - Developers of Chicago</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to Developers of Chicago homepage." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <motion.div 
          className="text-center max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
            <SearchX className="w-12 h-12 text-white/30" />
          </div>
          <h1 className="text-8xl font-bold font-display mb-4 text-transparent bg-clip-text bg-gradient-to-r from-mint to-royalBlue">404</h1>
          <p className="text-xl text-white/60 mb-2">Page not found</p>
          <p className="text-sm text-white/30 mb-10">
            The page <code className="text-mint/60 bg-white/5 px-2 py-0.5 rounded">{location.pathname}</code> doesn't exist.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-mint text-darkNavy font-bold hover:bg-mint/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Homepage
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
