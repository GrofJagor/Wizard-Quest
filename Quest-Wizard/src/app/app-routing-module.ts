import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginForm } from './components/login-form/login-form';
import { RegisterForm } from './components/register-form/register-form';
import { QuestBoard } from './components/quest-board/quest-board';
import { WizardList } from './components/wizard-list/wizard-list';
import { HomePage } from './components/home-page/home-page';
import { WizardProfile } from './components/wizard-profile/wizard-profile';
import { WizardBoard } from './components/wizard-board/wizard-board';
import { QuestDetails } from './components/quest-details/quest-details';
import { authGuard, homeGuard, towerGuard } from './auth.guard';
import { QuestCreation } from './components/quest-creation/quest-creation';

const routes: Routes = [
  { 
    path: '', 
    component: HomePage, 
    pathMatch: 'full', 
    canActivate: [homeGuard]
  },
  
  { path: 'login', component: LoginForm },
  { path: 'register', component: RegisterForm },
  { path: 'register/:user', component: RegisterForm },
  { path: 'quests/new', component:QuestCreation, canActivate: [towerGuard]},
  { path: 'quests', component: QuestBoard },
  { path: 'quests/:id', component: QuestDetails },
  { path: 'wizards', component: WizardBoard },
  { path: 'profile/:user', component: WizardProfile },

  { path: '**', redirectTo: '' },
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
