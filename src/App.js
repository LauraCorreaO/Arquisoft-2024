import './App.css';
import { FlightSearch } from './components/FlightSearch';
import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/',
    element: <FlightSearch />,
    // errorElement: <SignUp /> 
  },
]);

const App = () => {
  return (
    <React.Fragment>
      <RouterProvider router={router} />
    </React.Fragment>

  );
};

export default App;