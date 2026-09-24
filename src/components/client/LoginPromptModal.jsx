import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { X, Heart } from 'lucide-react';

const LoginPromptModal = () => {
  const { showLoginPrompt, setShowLoginPrompt } = useStore();
  const navigate = useNavigate();

  if (!showLoginPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blur Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={() => setShowLoginPrompt(false)}
      />
      
      {/* Modal */}
      <div className="relative bg-white border border-black/5 p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={() => setShowLoginPrompt(false)} 
          className="absolute top-4 right-4 text-primary/40 hover:text-primary transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-2">
            <Heart size={28} />
          </div>
          
          <h3 className="font-display text-xl uppercase tracking-widest text-primary">Save Favorites</h3>
          
          <p className="text-sm text-primary/60 font-serif italic pb-4">
            Create an account or sign in to save your favorite pieces and access them across all your devices.
          </p>
          
          <div className="w-full space-y-3">
            <button 
              onClick={() => {
                setShowLoginPrompt(false);
                navigate('/register');
              }}
              className="w-full bg-primary text-white text-xs tracking-widest py-3 hover:bg-black transition-colors uppercase font-medium"
            >
              Create Account
            </button>
            <button 
              onClick={() => {
                setShowLoginPrompt(false);
                navigate('/login');
              }}
              className="w-full bg-white border border-primary/20 text-primary text-xs tracking-widest py-3 hover:border-primary transition-colors uppercase font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
