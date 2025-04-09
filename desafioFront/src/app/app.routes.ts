import { Routes } from '@angular/router';
import { PessoaComponent } from './components/pessoa-component/pessoa.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: 'pessoas',
    component: PessoaComponent,
  },
  { path: '', redirectTo: '/pessoas', pathMatch: 'full' },
];
