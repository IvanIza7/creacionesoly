import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from './components/ErrorBoundary'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/client/Home'
import CategoryDetail from './pages/client/CategoryDetail'
import Favorites from './pages/client/Favorites'
import Promotions from './pages/client/Promotions'
import NewArrivals from './pages/client/NewArrivals'
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import ForgotPassword from './pages/client/ForgotPassword';
import ResetPassword from './pages/client/ResetPassword';
import Profile from './pages/client/Profile';
import AdminLayout from './pages/admin/AdminLayout'
import VerifyEmail from './pages/client/VerifyEmail'
import Inventory from './pages/admin/Inventory'
import SiteEditor from './pages/admin/SiteEditor'
import Settings from './pages/admin/Settings'
import Catalogs from './pages/admin/Catalogs'
import Subscribers from './pages/admin/Subscribers'
import { useStore } from './store/useStore'

function App() {
  const checkAuth = useStore(state => state.checkAuth);
  const fetchBusinessSettings = useStore(state => state.fetchBusinessSettings);
  
  useEffect(() => {
    checkAuth();
    fetchBusinessSettings();
  }, [checkAuth, fetchBusinessSettings]);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="category/:categoryId" element={<CategoryDetail />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="new-arrivals" element={<NewArrivals />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/verify" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Inventory />} />
        <Route path="catalogs" element={<Catalogs />} />
        <Route path="editor" element={<SiteEditor />} />
        <Route path="settings" element={<Settings />} />
        <Route path="subscribers" element={<Subscribers />} />
      </Route>
    </Routes>
    </ErrorBoundary>
    </HelmetProvider>
  )
}

export default App
