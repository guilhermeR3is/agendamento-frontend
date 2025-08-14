import { useState, useEffect } from 'react'
import Login from './components/Login'
import DashboardSimple from './components/DashboardSimple'
import NewAppointmentOriginal from './components/NewAppointmentOriginal'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import { initializeExampleData } from './services/localStorage'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('login')
  const [userData, setUserData] = useState(null)
  const [adminData, setAdminData] = useState(null)
  const [isAdminRoute, setIsAdminRoute] = useState(false)

  useEffect(() => {
    // Inicializar dados de exemplo se necessário
    initializeExampleData()
    
    // Verificar se é rota admin
    const checkAdminRoute = () => {
      const isAdmin = window.location.pathname.startsWith('/admin')
      setIsAdminRoute(isAdmin)
      if (isAdmin) {
        setCurrentView('admin-login')
      } else {
        setCurrentView('login')
      }
    }
    
    checkAdminRoute()
    
    // Escutar mudanças na URL
    window.addEventListener('popstate', checkAdminRoute)
    return () => window.removeEventListener('popstate', checkAdminRoute)
  }, [])

  const handleLogin = (data) => {
    setUserData(data)
    if (data.user_exists && data.has_appointments) {
      setCurrentView('dashboard')
    } else {
      setCurrentView('new-appointment')
    }
  }

  const handleAdminLogin = (data) => {
    setAdminData(data)
    setCurrentView('admin-dashboard')
  }

  const handleLogout = () => {
    setUserData(null)
    setCurrentView('login')
  }

  const handleAdminLogout = () => {
    setAdminData(null)
    setCurrentView('admin-login')
  }

  const handleNewAppointment = () => {
    setCurrentView('new-appointment')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
  }

  const handleAppointmentComplete = () => {
    setCurrentView('dashboard')
  }

  const handleUserDataUpdate = (updatedUserData) => {
    setUserData(updatedUserData)
  }

  // Renderização para rotas administrativas
  if (isAdminRoute) {
    return (
      <div className="App">
        {currentView === 'admin-login' && (
          <AdminLogin onLogin={handleAdminLogin} />
        )}
        
        {currentView === 'admin-dashboard' && (
          <AdminDashboard
            adminData={adminData}
            onLogout={handleAdminLogout}
          />
        )}
      </div>
    )
  }

  // Renderização para rotas públicas
  return (
    <div className="App">
      {currentView === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      
      {currentView === 'dashboard' && (
        <DashboardSimple
          userData={userData}
          onNewAppointment={handleNewAppointment}
          onLogout={handleLogout}
        />
      )}
      
      {currentView === 'new-appointment' && (
        <NewAppointmentOriginal
          userData={userData}
          onBack={handleBackToDashboard}
          onComplete={handleAppointmentComplete}
          onUserDataUpdate={handleUserDataUpdate}
        />
      )}
    </div>
  )
}

export default App
