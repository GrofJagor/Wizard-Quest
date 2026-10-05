import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { QuestBoard } from './components/quest-board/quest-board';
import { QuestDetails } from './components/quest-details/quest-details';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { QuestsEffects } from './store/quest.effects';
import { environment } from '../environments/environment';
import { questsReducer } from './store/quest.reducer';
import { NavigationBar } from './components/navigation-bar/navigation-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuestCreation } from './components/quest-creation/quest-creation';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WizardList } from './components/wizard-list/wizard-list';
import { WizardProfile } from './components/wizard-profile/wizard-profile';
import { wizardsReducer } from './store/wizard.reducer';
import { WizardsEffects } from './store/wizard.effects';
import { LoginForm } from './components/login-form/login-form';
import { RegisterForm } from './components/register-form/register-form';
import { authInterceptor } from './services/auth.interceptor';
import { HomePage } from './components/home-page/home-page';
import { WizardBoard } from './components/wizard-board/wizard-board';
import { towersReducer } from './store/tower.reducer';
import { TowersEffects } from './store/tower.effects';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    App,
    QuestBoard,
    NavigationBar,
    QuestDetails,
    QuestCreation,
    WizardList,
    WizardProfile,
    LoginForm,
    RegisterForm,
    HomePage,
    WizardBoard,
  ],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forFeature('quests', questsReducer),
    StoreModule.forFeature('wizards', wizardsReducer),
    StoreModule.forFeature('towers', towersReducer),
    StoreModule.forRoot({ quests: questsReducer, wizards: wizardsReducer, towers: towersReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: false }),
    EffectsModule.forRoot([QuestsEffects, WizardsEffects, TowersEffects]),
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}
