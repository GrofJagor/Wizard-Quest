import { Component, inject } from '@angular/core';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHatWizard } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navigation-bar',
  standalone: false,
  styleUrl: './navigation-bar.scss',
  templateUrl: './navigation-bar.html',
})
export class NavigationBar {
  
  authService = inject(AuthService);

  
   wizardHatIcon = faHatWizard;

  isMenuOpen: boolean = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

 
  logout(): void {
    this.authService.logout();
  }
}
