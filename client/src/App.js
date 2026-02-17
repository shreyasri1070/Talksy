
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { Children, useEffect } from 'react';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Home from './pages/Home';
import VerifyEmail from './pages/verifyEmail';

const Layout = () => {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [isAuthenticated]);

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
};
const router=createBrowserRouter([
  {
  path:"/",
  element: <Layout/>,
  children:[{
    path:"/register",
    element:<Register/>
  },
   {
        path: "login",
        element: <Login />,
      },
       {
        path: "/",
        element: <Home />,
      },
      {
        path: "users/:id/verify/:token",
        element: <VerifyEmail />,
      },

]
  }
])

function App() {
  return (
   <AuthProvider>
    <ProfileProvider>
 <RouterProvider router={router}>
<Toaster/>
 </RouterProvider>
    </ProfileProvider>
   </AuthProvider>
  );
}

export default App;
