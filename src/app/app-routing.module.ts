import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './about/about-page/about-page.component';
import { TodosPageComponent } from './components/todos-page/todos-page.component';

const routes: Routes = [
  {
    path: 'about',
    loadChildren: () => {
      return import('./about/about.module').then((m) => m.AboutModule);
    },
  },
  { path: 'todos/:status', component: TodosPageComponent },
  { path: '**', redirectTo: '/todos/all', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
