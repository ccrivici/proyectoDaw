import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { SeguridadService } from "./seguridad.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class SeguridadRouter implements CanActivate{

  /**
   *
   */
  constructor(private seguridadService: SeguridadService, private router: Router) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.seguridadService.onSesion()) {
      return true;
    }else{
      this.router.navigate(['/login'])
    }
    throw new Error("Method not implemented.");
  }
  }

