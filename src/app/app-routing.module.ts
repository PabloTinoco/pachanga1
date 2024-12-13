import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { GuestGuard } from './auth/guest.guard';

const routes: Routes = [
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard]  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
