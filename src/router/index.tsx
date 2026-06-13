import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { DashboardPage } from '../pages/DashboardPage'
import { FamiliaPage } from '../pages/familia/FamiliaPage'
import { OnboardingPage } from '../pages/familia/OnboardingPage'
import { MealPlanPage } from '../pages/familia/MealPlanPage'
import { MapPage } from '../pages/aventura/MapPage'
import { CozinhaPage } from '../pages/aventura/CozinhaPage'
import { BattlePage } from '../pages/aventura/BattlePage'
import { MercadinhoPage } from '../pages/MercadinhoPage'
import { RankingPage } from '../pages/RankingPage'
import { PrivacidadePage } from '../pages/PrivacidadePage'
import { TermosPage } from '../pages/TermosPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'familia', element: <FamiliaPage /> },
      { path: 'familia/onboarding', element: <OnboardingPage /> },
      { path: 'familia/plano', element: <MealPlanPage /> },
      { path: 'aventura/mapa', element: <MapPage /> },
      { path: 'aventura/cozinha', element: <CozinhaPage /> },
      { path: 'aventura/batalha', element: <BattlePage /> },
      { path: 'mercadinho', element: <MercadinhoPage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'privacidade', element: <PrivacidadePage /> },
      { path: 'termos', element: <TermosPage /> },
    ],
  },
])
