import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/dashboard.jsx'
import AlbumDetails from './pages/albumDetailsPage.jsx'
import Favorites from './pages/favoriteImages.jsx'
import SharedAlbums from './pages/sharedAlbums.jsx'

import { ToastContainer, Slide } from 'react-toastify'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/dashboard",
    element: <Dashboard/>
  },
  {
    path: "/albumDetails/:albumId",
    element: <AlbumDetails/>
  },
  {
    path: "/favorites",
    element: <Favorites/>
  },
  {
    path: "/albums/shared",
    element: <SharedAlbums/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Slide}
    />
    <RouterProvider router={router}/>
  </StrictMode>,
)

