import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import api from '../../api/axios';
import { LogOut, Settings, User, Loader2, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useStore();
  const brandConfig = useStore(state => state.siteConfig.brand);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 12) {
      setError('New password must be at least 12 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      setSuccess(response.data.message || 'Password changed successfully. Logging out...');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(async () => {
        await handleLogout();
      }, 3000);

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error changing password.');
      } else {
        setError('Server connection error.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white border border-black/5 p-6 text-center shadow-sm relative overflow-hidden group">
            {/* Background Blur effect element (decorative) */}
            <div className="absolute inset-0 bg-primary/5 backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="w-20 h-20 bg-[#f9f9f9] border border-black/10 mx-auto rounded-full flex items-center justify-center mb-4 relative z-10">
              <User size={32} className="text-primary/40" />
            </div>
            <h2 className="font-display text-xl text-primary tracking-wider relative z-10">{user.name}</h2>
            <p className="text-xs text-primary/60 font-serif italic mb-6 relative z-10">{user.email}</p>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 text-xs tracking-widest text-primary/60 hover:text-red-500 transition-colors uppercase relative z-10"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3">
          <div className="bg-white border border-black/5 shadow-sm">
            <div className="p-6 border-b border-black/5 bg-[#fbfbfb] flex items-center space-x-3">
              <Settings size={18} className="text-primary/60" />
              <h3 className="font-display text-lg uppercase tracking-widest">Account Settings</h3>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <h4 className="text-xs tracking-widest uppercase text-primary/60 mb-2">Change Password</h4>
                <div className="w-8 h-[1px] bg-accent mb-6"></div>
                
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 text-sm font-serif italic text-center">
                    {success}
                  </div>
                )}
                
                <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showCurrent ? 'text' : 'password'} 
                        required
                        value={currentPassword}
                        onChange={(e) => { setCurrentPassword(e.target.value); setError(''); }}
                        className="w-full bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors"
                      >
                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">New Password (Min. 12 chars)</label>
                    <div className="relative">
                      <input 
                        type={showNew ? 'text' : 'password'} 
                        required
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                        className="w-full bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors"
                      >
                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Confirm New Password</label>
                    <input 
                      type={showNew ? 'text' : 'password'} 
                      required
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      className="w-full bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" 
                    />
                  </div>

                  {error && <p className="text-red-500 text-xs mt-2 font-serif italic">{error}</p>}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-primary text-white text-xs tracking-widest py-3 px-8 hover:bg-black transition-colors uppercase font-medium flex items-center justify-center mt-4"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
