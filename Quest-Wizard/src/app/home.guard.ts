import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./services/auth";
import { inject } from "@angular/core";
import { map, take } from "rxjs";

export const homeGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user && (user.role === 'WIZARD' || user.role === 'TOWER')) {
        return router.createUrlTree(['/quests']);
      }
      
      return true; 
    })
  );
};