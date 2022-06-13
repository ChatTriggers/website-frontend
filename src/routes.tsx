import React from 'react';

import CreateAccountPage from './pages/CreateAccountPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MobileFilterPage from './pages/MobileFilterPage';
import ModulePage from './pages/ModulePage/ModulePage';
import ModulesListPage from './pages/ModulesListPage';
import PasswordResetPage from './pages/PasswordResetPage';
import ReleaseVerificationPage from './pages/ReleaseVerificationPage';

interface IRoute {
  route: string;
  component: React.ReactChild;
  name?: string;
}

const routes: IRoute[] = [
  { route: '/passwordreset', component: <PasswordResetPage />, name: 'Password Reset' },
  { route: '/login', component: <LoginPage />, name: 'Login' },
  { route: '/create-account', component: <CreateAccountPage />, name: 'Create Account' },
  { route: '/modules/v/:module([\\w]+)', component: <ModulePage /> },
  { route: '/modules/filter', component: <MobileFilterPage />, name: 'Module Filters' },
  {
    route: '/modules/verify/:module([\\w]+)',
    component: <ReleaseVerificationPage />,
    name: 'Release Verification',
  },
  { route: '/modules', component: <ModulesListPage />, name: 'Modules' },
  { route: '/', component: <HomePage /> },
];

export default routes;
