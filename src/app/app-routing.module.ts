import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { MyEmergensiesComponent } from './my-emergensies/my-emergensies.component';
import { OtherEmergensiesComponent } from './other-emergensies/other-emergensies.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from 'src/services/auth.guard';

const routes: Routes = [
  { path: "login", component: LoginComponent},
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard]  },
  { path: "myEmergencies", component: MyEmergensiesComponent, canActivate: [AuthGuard]  },
  { path: "otherEmergencies", component: OtherEmergensiesComponent, canActivate: [AuthGuard]  },
  { path: "**", redirectTo: "profile", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
