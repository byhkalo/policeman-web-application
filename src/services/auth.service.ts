import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import { Subscription, Observable, BehaviorSubject } from "rxjs";
import { auth } from "firebase";
import { Policeman } from "src/models/policeman.model";

@Injectable({providedIn: 'root'})

export class AuthService {
    constructor(private firebaseAuth: AngularFireAuth, private firebaseDatabase: AngularFireDatabase) {
        console.log("Create AuthService") 
        if (firebaseAuth.user != null) {
            console.log("TRY TO GET FIRE USER") 
            firebaseAuth.user.subscribe(user => {
                if (user == null) {
                    console.log("1 - FIRE USER IS NULL") 
                    this.isLoadedService = true
                    this.currentUserObservable.next(null)
                } else {
                    console.log("2 - FIRE USER NOT NULL") 
                    this.connectToCurrentUser(user.uid, (some) => {
                        this.isLoadedService = true
                    })
                }
            })
        } else {
            console.log("FIRE USER IS NULL") 
            this.isLoadedService = true
            this.currentUserObservable.next(null)
        }
    }

    currentUserSubscription: Subscription | null;
    private currentUser: Policeman | null;
    private isLoadedService: boolean = false
    private currentUserObservable = new BehaviorSubject<Policeman | null>(null);

    logInWithEmailAndPassword(email: string, password: string): Observable<firebase.User> {
        return new Observable(observable => {
            const session = auth.Auth.Persistence.SESSION
            this.firebaseAuth.auth.setPersistence(session).then(() => {
                this.firebaseAuth.auth.signInWithEmailAndPassword(email, password).then(credential => {
                    console.log('CREDENTIAN.user.uid = ' + credential.user.uid)
                    if (credential.user != null) {
                        console.log("credential.user " + credential.user)
                        console.log('try to connectToCurrentUser')
                        this.connectToCurrentUser(credential.user.uid, (policeman) => {
                            observable.next(credential.user);
                        });
                    }
                }).catch(error => {
                    console.log('catch ERROR' + error);
                });
            });
        });
    }

    private connectToCurrentUser(providerId: String, completion: (Policeman) => void) {
        console.log("providerId = " + providerId)
        this.currentUserSubscription = this.firebaseDatabase.object<Policeman>('Policeman/collection/'+providerId)
        .valueChanges().subscribe(dbUser => {
            console.log("connectToCurrentUser POLICEMAN = " + dbUser)
            this.currentUser = dbUser;
            this.currentUserObservable.next(dbUser);

            completion(dbUser)
        });
    }

    getCurrentUserObservable(): BehaviorSubject<Policeman | null> {
        return this.currentUserObservable;
    }

    authState(): Observable<firebase.User | null> {
        return this.firebaseAuth.authState;
    }

    logOut() {
        this.currentUser = null;
        this.currentUserSubscription.unsubscribe
        this.currentUserSubscription = null;
        this.firebaseAuth.auth.signOut();
    }

    isAuthenticated(): Observable<boolean> {
        console.log("Check isAuthenticated")
        if (this.currentUser != null) {
            console.log("currentUser IS NOT NULL")
            console.log("currentUser isAdmin = " + this.currentUser.isAdmin)
            return new Observable<boolean>(subs => {
                subs.next(!this.currentUser.isAdmin)
                subs.complete()
            }) 
        } else if (this.isLoadedService == true) {
            console.log("USER IS NULL AND isLoadedService == true")
            return new Observable<boolean>(subs => {
                subs.next(false)
                subs.complete()
            }) 
        } else { 
            console.log("USER IS NULL AND isLoadedService == false")
            return new Observable<boolean>(subs=>{
                console.log("subscribe on currentUser")
                this.currentUserObservable.subscribe(policeman => {
                    console.log("GET POLICEMAN")
                    console.log("POLICEMAN = " + policeman)
                    if (policeman != null) {
                        console.log("POLICEMAN NOT NULL")
                        subs.next(!policeman.isAdmin)
                    } else {
                        console.log("POLICEMAN IS NULL")
                        subs.next(false)
                    }
                    subs.complete()
                })
            })
        }
    }

    isAdmin(): boolean {
        if (this.currentUser != null) {
            return this.currentUser.isAdmin
        }
        return false;
    }

    isLoggedInApplication(): boolean {
        console.log('Firebase User' + this.firebaseAuth.auth.currentUser);
        return (this.firebaseAuth.auth.currentUser != null);
    }

}