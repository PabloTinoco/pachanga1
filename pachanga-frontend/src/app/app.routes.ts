import { Routes } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './components/auth/auth.guard';
import { GuestGuard } from './components/auth/guest.guard';
import { AddCourtComponent } from './components/add-court/add-court.component';
import { GroupsComponent } from './components/groups/groups.component';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { GroupDetailsComponent } from './components/group-details/group-details.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard]  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'add-court', component: AddCourtComponent, canActivate: [AuthGuard] },
  { path: 'groups/:courtId', component: GroupsComponent, canActivate: [AuthGuard] },
  { path: 'add-group/:courtId', component: AddGroupComponent, canActivate: [AuthGuard] },
  { path: 'group/:group_id/details', component:  GroupDetailsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

