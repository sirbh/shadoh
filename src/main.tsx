import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createRootRoute, createRoute, createRouter, Link, Outlet, RouterProvider } from '@tanstack/react-router'
import NameScreen from './components/nameScreen/NameScreen.tsx'
import GuessScreen from './components/guessScreen/GuessScreen.tsx'


const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: NameScreen,
})

const routeTree = rootRoute.addChildren([indexRoute])

const router = createRouter({ routeTree })

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
