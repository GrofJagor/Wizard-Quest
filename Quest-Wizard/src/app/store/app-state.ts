import { QuestsState } from "./quest.reducer";
import { TowersState } from "./tower.reducer";
import { WizardsState } from "./wizard.reducer";


export interface AppState {
    wizards: WizardsState;
    quests: QuestsState;
    towers: TowersState;
}
