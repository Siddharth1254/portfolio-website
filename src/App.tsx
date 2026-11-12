import { useCallback, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Loader } from '@/components/Loader';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

const App = () => {
  const [booted, setBooted] = useState(false);
  const onBooted = useCallback(() => setBooted(true), []);
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Loader onDone={onBooted} />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index booted={booted} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
