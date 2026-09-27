import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LoginModal from './components/LoginModal';
import LoginSection from './components/LoginSection';
import RailConnectBanner from './components/RailConnectBanner';
import USPCards from './components/USPCards';
import IndiaMap from './components/IndiaMap';
import Footer from './components/Footer';

// Login
import LoginPage from './pages/LoginPage';

// COA Operational Pages
import COADashboardPage  from './pages/COADashboardPage';
import COARequestsPage   from './pages/COARequestsPage';
import COASchedulePage   from './pages/COASchedulePage';

// Department Pages (P-Way / S&T / TRD — shared components)
import DeptDashboardPage from './pages/DeptDashboardPage';
import DeptRequestsPage  from './pages/DeptRequestsPage';
import DeptContactPage   from './pages/DeptContactPage';
import DeptDispatchPage  from './pages/DeptDispatchPage';

// Shared / legacy operational pages (still accessible from COA quick-nav)
import DashboardPage        from './pages/DashboardPage';
import OptimizerPage        from './pages/OptimizerPage';
import FreightForecastPage  from './pages/FreightForecastPage';
import FieldDispatchPage    from './pages/FieldDispatchPage';
import WeatherPage          from './pages/WeatherPage';
import AuditPage            from './pages/AuditPage';

import './App.css';

/* All routes that require login */
const PROTECTED = [
  'coa-dashboard', 'coa-requests', 'coa-schedule',
  'dept-dashboard', 'dept-requests', 'dept-contact', 'dept-dispatch', 'dept-schedule',
  'dashboard', 'optimizer', 'freight', 'field-dispatch', 'weather', 'audit', 'overview',
];

function resolveInitialRoute(savedUser) {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (!savedUser) {
    return raw === 'login' ? 'login' : 'landing';
  }
  // Logged-in user: honour hash if valid, else go to their home
  if (PROTECTED.includes(raw)) return raw;
  return homeRoute(savedUser);
}

function homeRoute(user) {
  if (!user) return 'landing';
  return user.authType === 'COA' ? 'coa-dashboard' : 'dept-dashboard';
}

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sahayak_rail_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [currentRoute, setCurrentRoute] = useState(() => {
    try {
      const saved = localStorage.getItem('sahayak_rail_user');
      return resolveInitialRoute(saved ? JSON.parse(saved) : null);
    } catch { return 'landing'; }
  });

  useEffect(() => {
    const handleHashChange = () => {
      const raw = window.location.hash.replace(/^#\/?/, '').trim();
      if (!currentUser) {
        setCurrentRoute(raw === 'login' ? 'login' : 'landing');
      } else {
        if (raw === 'login') {
          setCurrentRoute(homeRoute(currentUser));
        } else if (PROTECTED.includes(raw)) {
          setCurrentRoute(raw);
        } else {
          setCurrentRoute(homeRoute(currentUser));
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  const navigate = (route) => {
    if (!currentUser) {
      if (route === 'login') {
        window.location.hash = 'login';
        setCurrentRoute('login');
      } else {
        window.location.hash = '';
        setCurrentRoute('landing');
      }
      return;
    }
    if (route === 'landing') {
      window.location.hash = 'overview';
      setCurrentRoute('overview');
    } else {
      window.location.hash = route;
      setCurrentRoute(route);
    }
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    try { localStorage.setItem('sahayak_rail_user', JSON.stringify(userData)); } catch {}
    setIsLoginOpen(false);
    const dest = userData.redirectTo || homeRoute(userData);
    window.location.hash = dest;
    setCurrentRoute(dest);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try { localStorage.removeItem('sahayak_rail_user'); } catch {}
    window.location.hash = '';
    setCurrentRoute('landing');
  };

  const pageProps = { onNavigate: navigate, currentUser };

  return (
    <div className="app">
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigate}
        onOpenLogin={() => navigate('login')}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onNavigate={() => handleLogin({
          name: 'Er. R. K. Sharma',
          department: 'Engineering (P-Way)',
          role: 'Senior Section Engineer',
          division: 'Northern Railway / Delhi Div',
          authType: 'PWAY',
          redirectTo: 'dept-dashboard',
        })}
      />

      <main className="app-main-content">
        {/* ── Unauthenticated ─────────────────────────── */}
        {currentRoute === 'login' && (
          <LoginPage onLogin={handleLogin} onNavigate={navigate} />
        )}

        {!currentUser && currentRoute !== 'login' && (
          <>
            <Hero onNavigate={navigate} isLoggedIn={false} />
            <RailConnectBanner onNavigate={navigate} isLoggedIn={false} />
            <USPCards onNavigate={navigate} />
            <LoginSection onNavigate={navigate} onOpenLogin={() => navigate('login')} />
            <IndiaMap />
            <Footer onNavigate={navigate} />
          </>
        )}

        {/* ── COA Pages ───────────────────────────────── */}
        {currentUser && currentRoute === 'coa-dashboard' && (
          <COADashboardPage {...pageProps} />
        )}
        {currentUser && currentRoute === 'coa-requests' && (
          <COARequestsPage {...pageProps} />
        )}
        {currentUser && currentRoute === 'coa-schedule' && (
          <COASchedulePage {...pageProps} />
        )}

        {/* ── Dept placeholder (P-Way / S&T / TRD) ───── */}
        {currentUser && currentRoute === 'dept-dashboard' && (
          <DeptDashboardPage {...pageProps} />
        )}
        {currentUser && currentRoute === 'dept-requests' && (
          <DeptRequestsPage {...pageProps} />
        )}
        {currentUser && currentRoute === 'dept-contact' && (
          <DeptContactPage {...pageProps} />
        )}
        {currentUser && currentRoute === 'dept-dispatch' && (
          <DeptDispatchPage {...pageProps} />
        )}
        {/* dept-schedule reuses the COA schedule as read-friendly view */}
        {currentUser && currentRoute === 'dept-schedule' && (
          <COASchedulePage {...pageProps} />
        )}

        {/* ── Shared operational pages (COA quick-nav) ── */}
        {currentUser && currentRoute === 'dashboard' && (
          <DashboardPage {...pageProps} />
        )}
        {currentUser && currentRoute === 'optimizer' && (
          <OptimizerPage {...pageProps} />
        )}
        {currentUser && currentRoute === 'freight' && (
          <FreightForecastPage {...pageProps} />
        )}
        {currentUser && currentRoute === 'field-dispatch' && (
          <FieldDispatchPage {...pageProps} />
        )}
        {currentUser && currentRoute === 'weather' && (
          <WeatherPage {...pageProps} />
        )}
        {currentUser && currentRoute === 'audit' && (
          <AuditPage {...pageProps} />
        )}
        {currentUser && currentRoute === 'overview' && (
          <>
            <Hero onNavigate={navigate} isLoggedIn={true} />
            <RailConnectBanner onNavigate={navigate} isLoggedIn={true} />
            <USPCards onNavigate={navigate} />
            <LoginSection onNavigate={navigate} onOpenLogin={() => navigate('login')} />
            <IndiaMap />
            <Footer onNavigate={navigate} />
          </>
        )}
      </main>
    </div>
  );
}


