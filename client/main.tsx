import React from 'react';
import { createRoot } from 'react-dom/client';
import MinimalTest from './pages/MinimalTest';

function App() {
  return <MinimalTest />;
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
