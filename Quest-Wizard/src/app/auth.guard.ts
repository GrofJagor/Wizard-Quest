import { inject } from "@angular/core";
import { AuthService } from "./services/auth";
import { CanActivateFn, Router } from "@angular/router";
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


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      }

      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    })
  );
};

export const towerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user && user.role === 'TOWER') {
        return true;
      }
      
      return router.createUrlTree(['/']);
    })
  );
};