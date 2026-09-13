import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { QuestBoard } from './components/quest-board/quest-board';
import { QuestDetails } from './components/quest-details/quest-details';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { QuestsEffect } from './store/quest.effects';
import { environment } from '../environments/environment';
import { questsReducer } from './store/quest.reducer';


@NgModule({
  declarations: [App, QuestBoard, QuestDetails],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forFeature("quests", questsReducer),
    StoreModule.forRoot( { quests: questsReducer}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: false }),
    EffectsModule.forRoot([QuestsEffect])],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
