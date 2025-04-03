import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { useListenStorage } from '@/hooks/listen-storage';
import { router } from '@/router';
import store from '@/store';
import { Provider } from 'react-redux';

const App = () => {
  useListenStorage();

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;