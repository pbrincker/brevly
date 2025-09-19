import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { Redirect } from './pages/Redirect';
import { NotFound } from './pages/NotFound';
import Error404 from './pages/Error404';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function DebugLocation() {
  const location = useLocation();
  console.log('Current location:', location);
  return null;
}

function App() {
  console.log('App component rendered');
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <DebugLocation />
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/404" element={<Error404 />} />
            <Route path="/:shortUrl" element={<Redirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
