import { Injectable } from "@angular/core";
import { BehaviorSubject, from } from "rxjs";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Emergency, AmbulanceDetail, AcceptedPoliceman } from "src/models/emergency.model";
import { Policeman } from "src/models/policeman.model";
import { AgmCoreModule, MapsAPILoader } from "@agm/core";


@Injectable({providedIn: 'root'})

export class PolicemansService {
    
    private policemansAllObservable: BehaviorSubject<Array<Policeman>> = new BehaviorSubject([]);
    private policemansAllQuery: AngularFireList<Policeman>
    
    

    constructor(private fireDatabase: AngularFireDatabase) {
        this.policemansAllQuery = fireDatabase.list<Policeman>('users');
        this.policemansAllQuery.valueChanges().subscribe(policemans => {
            this.policemansAllObservable.next(policemans);
        });
    }

    getPolicemansAll(): BehaviorSubject<Array<Policeman>> {
        return this.policemansAllObservable;
    }

    getPolicemanById(id: string): Policeman | null {
        let somePoliceman = this.policemansAllObservable.value.find((policeman, index, policemansTemp) => {
            return policeman.id == id;
        });
        return somePoliceman
    }
    getPolicemansByIds(policemansIds: string[]): Policeman[] {
        var finalPolicemans: Policeman[] = []
        policemansIds.forEach(identifier => {
            let tempPoliceman = this.policemansAllObservable.value.find(element => {return element.id == identifier})
            if (tempPoliceman != null) {
                finalPolicemans.push(tempPoliceman);
            }
        })
        return finalPolicemans;
    }
}