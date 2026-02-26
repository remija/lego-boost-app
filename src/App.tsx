import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, ConnectionMenu, LanguageSwitcher } from './components';
import { LegoBoostProvider } from './context';
import { TestPage, R2D2Page, CodeLabPage } from './pages';
import './App.css';

function Navigation() {
  const { t } = useTranslation();
  return (
    <nav className="app__nav">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `app__nav-link ${isActive ? 'app__nav-link--active' : ''}`
        }
      >
        {t('nav.r2d2')}
      </NavLink>
      <NavLink
        to="/test"
        className={({ isActive }) =>
          `app__nav-link ${isActive ? 'app__nav-link--active' : ''}`
        }
      >
        {t('nav.test')}
      </NavLink>
      <NavLink
        to="/code-lab"
        className={({ isActive }) =>
          `app__nav-link ${isActive ? 'app__nav-link--active' : ''}`
        }
      >
        {t('nav.codeLab')}
      </NavLink>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="app">
      <div className="app__header-bar">
        <LanguageSwitcher />
        <ConnectionMenu />
      </div>
      <div className="app__container">
        <Header />
        <Navigation />
        <Routes>
          <Route path="/" element={<R2D2Page />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/code-lab" element={<CodeLabPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LegoBoostProvider>
        <AppContent />
      </LegoBoostProvider>
    </BrowserRouter>
  );
}

export default App;
