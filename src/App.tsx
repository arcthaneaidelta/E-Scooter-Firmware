import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { ModelsPage } from './pages/ModelsPage';
import { ModelDetailPage } from './pages/ModelDetailPage';
import { ShopPage } from './pages/ShopPage';
import { ActivatePage } from './pages/ActivatePage';
import { AccountPage } from './pages/AccountPage';
import { DocsPage } from './pages/DocsPage';
import { TestReportPage } from './pages/TestReportPage';
import { LegalPage } from './pages/LegalPage';
import { AboutDemoPage } from './pages/AboutDemoPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/models/:id" element={<ModelDetailPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/activate" element={<ActivatePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/test-report" element={<TestReportPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/about-demo" element={<AboutDemoPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
