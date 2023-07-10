import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangerComponent } from './components/exchanger/exchanger.component';

const routes: Routes = [
  { path: 'home', component: ExchangerComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
