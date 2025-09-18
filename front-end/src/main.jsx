import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import VerifyPage from './pages/VerifyPage'
import AboutPage from './pages/AboutPage'
import AdminDashboard from './pages/Admin/AdminDashboard'
import ContactPage from './pages/ContactPage'
import ScrollToTop from './lib/scrollToTop'
import AdminLogin from './pages/Admin/AdminLogin'
import { AuthProvider } from './lib/auth'
import IssuePage from './pages/IssuePage'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/verify' element={<VerifyPage/>} />
        <Route path='/about' element={<AboutPage/>} />
        <Route path='/admin-login' element={<AdminLogin/>} />
        <Route path='/admin' element={<AdminDashboard/>} />
        <Route path='/contact' element={<ContactPage/>} />
        <Route path='/issue-certificate' element={<IssuePage/>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)
