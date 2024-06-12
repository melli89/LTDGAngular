import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ListcreatorComponent } from './listcreator/listcreator.component';
import { RulesComponent } from './rules/rules.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from './utils/auth.guard';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'listmaker/:id', component: ListcreatorComponent},
  {path: 'rules', component: RulesComponent},


  {path: 'user', canActivate: [authGuard], data: {roles: ["ROLE_ADMIN", "ROLE_USER"]}, component: UserComponent},
  {path: 'admin', canActivate: [authGuard], data: {roles: ["ROLE_ADMIN"]}, component: AdminComponent},

  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
