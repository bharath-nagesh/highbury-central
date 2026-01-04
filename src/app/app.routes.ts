import { Routes } from '@angular/router';
import { News } from './components/news/news';
import { Fixtures } from './components/fixtures/fixtures';
import { Transfers } from './components/transfers/transfers';
import { Stats } from './components/stats/stats';

export const routes: Routes = [
  { path: '', redirectTo: '/news', pathMatch: 'full' },
  { path: 'news', component: News },
  { path: 'fixtures', component: Fixtures },
  { path: 'transfers', component: Transfers },
  { path: 'stats', component: Stats }
];
