import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Wizard } from '../../models/wizard';

@Component({
  selector: 'app-wizard-list',
  standalone: false,
  styleUrl: './wizard-list.scss',
  templateUrl: './wizard-list.html',
})
export class WizardList {
  @Input() wizards: Wizard[] = [];
 

  @Input() selected: string[] = [];
 
  @Output() selectedChange = new EventEmitter<string[]>();
 
  searchTerm = '';
 
  get filteredWizards(): Wizard[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.wizards;
    }
    return this.wizards.filter(
      (wizard) =>
        wizard.name.toLowerCase().includes(term) ||
        wizard.affinity.toLowerCase().includes(term)
    );
  }
 
  isSelected(id: string): boolean {
    return this.selected.includes(id);
  }
 
  toggle(id: string): void {
    const next = this.isSelected(id)
      ? this.selected.filter((wizardId) => wizardId !== id)
      : [...this.selected, id];
    this.selectedChange.emit(next);
  }
 
  trackByWizardId(_index: number, wizard: Wizard): string{
    return wizard.id;
  }

}