import { Component } from '@angular/core';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHatWizard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navigation-bar',
  standalone: false,
  styleUrl: './navigation-bar.scss',
  templateUrl: './navigation-bar.html',
})
export class NavigationBar {

   wizardHatIcon = faHatWizard;

  isMenuOpen: boolean = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
