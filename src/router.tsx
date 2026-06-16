import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from './layout/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { ModulePlaceholder } from './pages/ModulePlaceholder'
import { Prehospitalizacion } from './pages/Prehospitalizacion'

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
      {
        path: ':modulePath',
        element: <ModulePlaceholder />,
      },
    ],
  },
])
