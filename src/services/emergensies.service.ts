import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Emergency, AmbulanceDetail, AcceptedPoliceman } from "src/models/emergency.model";
import * as firebase from 'firebase/app';
import 'firebase/database';
import { Policeman } from "src/models/policeman.model";
import { AuthService } from "./auth.service";


@Injectable({providedIn: 'root'})

export class EmergenciesService {
    
    private emergensiesAllQuery: AngularFireList<Emergency>
    private emergensiesMyObservable: BehaviorSubject<Array<Emergency>> = new BehaviorSubject([]);
    private emergensiesOtherObservable: BehaviorSubject<Array<Emergency>> = new BehaviorSubject([]);

    private emergensiesAll: Emergency[] = []

    private currentPoliceman: Policeman | null;

    constructor(private fireDatabase: AngularFireDatabase, private authService: AuthService) {
        console.log('EmergenciesService')
        authService.getCurrentUserObservable().subscribe(tempPoliceman => {
            this.currentPoliceman = tempPoliceman;
            this.recalculateEmergencies()
        });
        this.emergensiesAllQuery = fireDatabase.list<Emergency>('Emergency/collection');
        this.emergensiesAllQuery.valueChanges().subscribe(emergencies => {
            console.log('Get Emergencies')
            console.log(emergencies)
            this.emergensiesAll = emergencies;
            this.recalculateEmergencies();
        });
    }

    recalculateEmergencies() {
        if (this.currentPoliceman == null) {
            this.emergensiesMyObservable.next([]);
            this.emergensiesOtherObservable.next([]);
        } else {
            let userId = this.currentPoliceman.id;
            var myEmergencies: Emergency[] = []
            var otherEmergencies: Emergency[] = []
            this.emergensiesAll.forEach(emerg => {
                if (emerg.acceptedPolicemans == undefined) {
                    otherEmergencies.push(emerg)
                } else {
                    let myAcc = emerg.acceptedPolicemans.find((accPol, index, arr) => {
                        if (accPol == undefined) {
                            return false
                        }
                        return accPol.id == userId;
                    })
                    if ((myAcc != null) || (myAcc != undefined)) {
                        myEmergencies.push(emerg)
                    } else {
                        otherEmergencies.push(emerg)
                    }
                }
            })
            this.emergensiesMyObservable.next(myEmergencies);
            this.emergensiesOtherObservable.next(otherEmergencies);
        }
    }

    getEmergensiesMy(): BehaviorSubject<Array<Emergency>> {
        return this.emergensiesMyObservable;
    }
    getEmergenciesOther(): BehaviorSubject<Array<Emergency>> {
        return this.emergensiesOtherObservable;
    }
    // Unmanaged Orders
    createEmergency(latitude: number, longitude: number, info: string, requestPerson: string, 
        isRequestAmbulance: boolean, acceptedPolicemansIds: string[]) {
        
            console.log("Create Emergency")
            console.log("latitude = " + latitude)
            console.log("longitude = " + longitude)
            console.log("info = " + info)
            console.log("requestPerson = " + requestPerson)
            console.log("isRequestAmbulance = " + isRequestAmbulance)
            console.log("acceptedPolicemansIds = " + acceptedPolicemansIds)
        let ambulanceDetail: AmbulanceDetail = {isRequested: isRequestAmbulance, isCompleted: false};
        let acceptedPolicemans: AcceptedPoliceman[] = acceptedPolicemansIds.map(element => {
            return { id: element, isAccept: false };
        });
        var newEmerg = new Emergency();
        newEmerg.latitude = latitude;
        newEmerg.longitude = longitude;
        newEmerg.info = info;
        newEmerg.requestPerson = requestPerson;
        newEmerg.ambulanceDetail = ambulanceDetail;
        newEmerg.acceptedPolicemans = acceptedPolicemans;
        let date = new Date()
        newEmerg.timestamp = date.valueOf() / 1000;
        newEmerg.id = this.fireDatabase.createPushId()    
        this.emergensiesAllQuery.update(newEmerg.id, newEmerg);
    }
    updateEmergency(emergency: Emergency, latitude: number, longitude: number, info: string, requestPerson: string, ambulanceDetail: AmbulanceDetail, acceptedPolicemans: AcceptedPoliceman[]) {
        emergency.latitude = latitude;
        emergency.longitude = longitude;
        emergency.info = info;
        emergency.requestPerson = requestPerson;
        emergency.ambulanceDetail = ambulanceDetail;
        emergency.acceptedPolicemans = acceptedPolicemans;
        this.emergensiesAllQuery.update(emergency.id, emergency);
    }
    setRequestAmbulanceEmergency(emergency: Emergency, isRequested: boolean) {
        emergency.ambulanceDetail.isRequested = isRequested
        emergency.ambulanceDetail.isCompleted = false
        this.emergensiesAllQuery.update(emergency.id, emergency)
    }
    setAmbulanceCompletedEmergency(emergency: Emergency, isCompleted: boolean) {
        console.log("setAmbulanceCompletedEmergency")
        console.log("isCompleted " + isCompleted)
        if (emergency.ambulanceDetail.isRequested) {
            console.log("Try... ")
            emergency.ambulanceDetail.isCompleted = isCompleted
            this.emergensiesAllQuery.update(emergency.id, emergency)
            console.log("Updated")
        }
    }
    acceptPolicemanToEmergency(emergency: Emergency, policeman: Policeman) {
        var acceptedPolicemans = emergency.acceptedPolicemans
        if (acceptedPolicemans == undefined) {
            acceptedPolicemans = []
        }
        console.log("acceptedPolicemans = " + acceptedPolicemans)
        console.log("acceptedPolicemans.lenght = " + acceptedPolicemans.length)
        let checkPoliceman = acceptedPolicemans.find((tempPoliceman, index, array) => {
            if (tempPoliceman == undefined) {
                return false;
            }
            return tempPoliceman.id == policeman.id
        })
        if (checkPoliceman == undefined) {
            let tempAccept = new AcceptedPoliceman();
            tempAccept.id = policeman.id
            tempAccept.isAccept = true
            acceptedPolicemans.push(tempAccept)
            emergency.acceptedPolicemans = acceptedPolicemans
            this.emergensiesAllQuery.update(emergency.id, emergency)
        }
    }
    removeEmergency(emergency: Emergency) {
        this.emergensiesAllQuery.remove(emergency.id)
    }
}