import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ToastProvider } from './components/ui/Toast';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { PageTransition } from './components/layout/PageTransition';

import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { DocumentView } from './pages/DocumentView';
import { ManageUsers } from './pages/ManageUsers';
import { PrintQueue } from './pages/PrintQueue';
import { AdminPortal } from './pages/AdminPortal';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';

import { LessonPage } from './pages/generate/LessonPage';
import { QuestionsPage } from './pages/generate/QuestionsPage';
import { SchemePage } from './pages/generate/SchemePage';
import { ExamPage } from './pages/generate/ExamPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <><ScrollToTop /><PageTransition><Landing /></PageTransition></>,
  },
  {
    path: '/auth',
    element: <><ScrollToTop /><PageTransition><Auth /></PageTransition></>,
  },
  {
    path: '/privacy',
    element: <><ScrollToTop /><PageTransition><PrivacyPolicy /></PageTransition></>,
  },
  {
    path: '/terms',
    element: <><ScrollToTop /><PageTransition><TermsOfService /></PageTransition></>,
  },
  {
    element: <><ScrollToTop /><ProtectedRoute /></>,
    children: [
      {
        path: '/dashboard',
        element: <PageTransition><Dashboard /></PageTransition>,
      },
      {
        path: '/history',
        element: <PageTransition><History /></PageTransition>,
      },
      {
        path: '/documents/:id',
        element: <PageTransition><DocumentView /></PageTransition>,
      },
      {
        path: '/manage-users',
        element: <PageTransition><ManageUsers /></PageTransition>,
      },
      {
        path: '/print-queue',
        element: <PageTransition><PrintQueue /></PageTransition>,
      },
      {
        path: '/settings',
        element: <PageTransition><Settings /></PageTransition>,
      },
      {
        path: '/admin-portal',
        element: <PageTransition><AdminPortal /></PageTransition>,
      },
      {
        path: '/generate/lesson',
        element: <PageTransition><LessonPage /></PageTransition>,
      },
      {
        path: '/generate/questions',
        element: <PageTransition><QuestionsPage /></PageTransition>,
      },
      {
        path: '/generate/scheme',
        element: <PageTransition><SchemePage /></PageTransition>,
      },
      {
        path: '/generate/exam',
        element: <PageTransition><ExamPage /></PageTransition>,
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      }
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <SmoothScroll>
        <RouterProvider router={router} />
      </SmoothScroll>
      <ToastProvider />
    </ThemeProvider>
  );
}
