import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from './layout/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { ModulePlaceholder } from './pages/ModulePlaceholder'
import { NotFound } from './pages/NotFound'
import { Prehospitalizacion } from './pages/Prehospitalizacion'
import { modules } from './data/modules'

const placeholderModules = modules.filter((module) => module.path !== '/prehospitalizacion')

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'prehospitalizacion',
        element: <Prehospitalizacion />,
      },
      ...placeholderModules.map((module) => ({
        path: module.path.replace(/^\//, ''),
        element: <ModulePlaceholder />,
      })),
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

