import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'batches', pathMatch: 'full' },
  {
    path: 'batches',
    loadComponent: () => import('./pages/batches/batches').then((m) => m.Batches),   // correct
  },
  
    {
    path: 'batches/:id',
    loadComponent: () => import('./pages/batch-detail/batch-detail').then((m) => m.BatchDetail),
  },

    {
    path: 'interns',
    loadComponent: () => import('./pages/interns/interns').then((m) => m.Interns),
  },
];