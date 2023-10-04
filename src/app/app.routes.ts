import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./menu/menu.component').then((m) => m.MenuComponent),
    children: [
      {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./history/history.page').then((m) => m.HistoryPage),
      },
      {
        path: 'own-plan',
        loadComponent: () =>
          import('./own-plan/own-plan.page').then((m) => m.OwnPlanPage),
      },
      {
        path: '404',
        loadComponent: () =>
          import('./error-page/error-page.page').then((m) => m.ErrorPagePage),
      },
    ],
  },

  { path: '**', redirectTo: '/404' },
];
