import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home';
import { AssetDetailsComponent } from './assets/asset-details/asset-details'; // Check
// import { UserManagerComponent } from './auth/user-manager/user-manager';
import { UserManagerComponent } from './auth/user-manager/user-manager';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'assets/:id', component: AssetDetailsComponent }, // The "Eye" button goes here
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'users', component: UserManagerComponent },
  // We temporarily removed the '**' redirect so we can see errors in the console
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
