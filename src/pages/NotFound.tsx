import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-6xl font-display font-bold text-primary-400">404</span>
        </div>
        
        <h1 className="text-3xl font-display font-bold text-white mb-2">Page Not Found</h1>
        
        <p className="text-neutral-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
          
          <Link 
            to="/"
            className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl transition-colors"
          >
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;