import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider,  } from '@/components/AuthContext';
import { useListenStorage } from '@/hooks/listen-storage';
import { router } from '@/router';

const App = () => {
  useListenStorage();

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;