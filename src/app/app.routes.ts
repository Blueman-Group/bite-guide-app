import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./start/start.page').then((m) => m.StartPage),
  },
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
    ],
  },
  {
    path: 'setup-1',
    loadComponent: () =>
      import('./setup1/setup1.page').then((m) => m.Setup1Page),
  },
  {
    path: 'setup-2',
    loadComponent: () =>
      import('./setup2/setup2.page').then((m) => m.Setup2Page),
  },
];
