import React from 'react';
import PasswordResetPage from './pages/PasswordResetPage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ModulesListPage from './pages/ModulesListPage';
import MobileFilterPage from './pages/MobileFilterPage';
import ModulePage from './pages/ModulePage';
import HomePage from './pages/HomePage';

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
  { route: '/modules', component: <ModulesListPage />, name: 'Modules' },
  { route: '/', component: <HomePage /> },
];

export default routes;
