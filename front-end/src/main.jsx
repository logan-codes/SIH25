import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, HashRouter } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import VerifyPage from './pages/VerifyPage'
import AboutPage from './pages/AboutPage'
import AdminDashboard from './pages/Admin/AdminDashboard'
import ContactPage from './pages/ContactPage'
import ScrollToTop from './lib/scrollToTop'
import AdminLogin from './pages/Admin/AdminLogin'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import IssuePage from './pages/IssuePage'
import { AuthProvider } from './lib/AuthContext'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<AdminLogin/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/verify' element={<VerifyPage/>} />
        <Route path='/about' element={<AboutPage/>} />
        <Route path='/contact' element={<ContactPage/>} />
        
        {/* Protected Routes */}
        <Route path='/admin' element={
          <ProtectedRoute>
            <AdminDashboard/>
          </ProtectedRoute>
        } />
        <Route path='/issue-certificate' element={
          <ProtectedRoute>
            <IssuePage/>
          </ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  </AuthProvider>
)
