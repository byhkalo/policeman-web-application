import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { map, tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})

export class AuthGuard implements CanActivate {

    path: ActivatedRouteSnapshot[];
    readonly route: ActivatedRouteSnapshot;
    // constructor(path: ActivatedRouteSnapshot[])
    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        console.log('ROUTER GUARD + ' + next);
        return new Observable<boolean>(subs=>{
            console.log('inside GUARD ');
            this.authService.isAuthenticated().subscribe((nextValue=> {
                console.log('isAuthenticated() + ' + nextValue);
                if (nextValue == true) {
                    subs.next(true) 
                } else {
                    this.router.navigate(['login'])
                    subs.next(false) 
                }   
            }))
        })
    }
}