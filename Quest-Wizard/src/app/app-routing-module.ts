import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginForm } from './components/login-form/login-form';
import { RegisterForm } from './components/register-form/register-form';
import { QuestBoard } from './components/quest-board/quest-board';
import { WizardList } from './components/wizard-list/wizard-list';
import { HomePage } from './components/home-page/home-page';
import { WizardProfile } from './components/wizard-profile/wizard-profile';
import { WizardBoard } from './components/wizard-board/wizard-board';

const routes: Routes = [
  {path: 'login', component:LoginForm},
  {path: 'register', component:RegisterForm},
  {path: 'quests', component:QuestBoard},
  {path: 'wizards', component:WizardBoard},
  {path: '', component:HomePage},
  {path: 'register/:user', component:RegisterForm},
  {path: 'profile/:user', component:WizardProfile},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
