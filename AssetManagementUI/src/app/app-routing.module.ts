import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home';
import { AssetDetailsComponent } from './assets/asset-details/asset-details';
import { UserManagerComponent } from './auth/user-manager/user-manager';
import { authGuard } from './core/guards/auth-guard'; // Import the guard

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // PROTECTED ROUTES (Locked by authGuard)
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'assets/:id', component: AssetDetailsComponent, canActivate: [authGuard] },
  { path: 'users', component: UserManagerComponent, canActivate: [authGuard] },

  // DEFAULT REDIRECT (Now goes to Login)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // CATCH-ALL (Any typo in the URL goes to Login)
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
