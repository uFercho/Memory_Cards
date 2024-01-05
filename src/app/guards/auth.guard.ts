import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UtilsService } from '../shared/services/utils.service';
import { User } from '../models/user.interface';

export const AuthGuard: CanActivateFn = (route, state) => {

  const utils = inject(UtilsService);

  const user: User = utils.getUserValue;

  if (user?.name) {
    return true;
  }
  else {
    utils.routerLink('/auth');
    return false
  }

};
