import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from 'src/services/auth.service';
import { Policeman } from 'src/models/policeman.model';
import { EmergenciesService } from 'src/services/emergensies.service';
import { Emergency } from 'src/models/emergency.model';
import { PolicemansService } from 'src/services/policemans.service';
import { Marker } from 'src/models/marker.model';
import { EmergencyDetailComponent } from '../emergency-detail/emergency-detail.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Detail', id: 1, cols: 1, rows: 1 },
          { title: 'Statistic', id: 2, cols: 1, rows: 1 },
          { title: 'Requested Emergencies', id: 0, cols: 1, rows: 1 },
        ];
      }

      return [
        { title: 'Detail', id: 1, cols: 1, rows: 1 },
        { title: 'Statistic', id: 2, cols: 1, rows: 1 },
        { title: 'Requested Emergencies', id: 0, cols: 2, rows: 1 },
      ];
    })
  );

  policeman: Policeman = new Policeman()

  cityLatitude = 50.061650;
  cityLongitude = 19.938444;

  markers: Marker[] = []
  myEmergencies: Emergency[] = []
  myEmergCount: number = 0
  otherEmergCount: number = 0

  lastEmergency: Emergency = new Emergency()
  lastEmergencyRequestTime: string = ''
  lastEmergencyLatitude: number = 0
  lastEmergencyLongitude: number = 0
  lastEmergencyRequestPerson: string = ''

  openedWindow : number = 0; // alternative: array of numbers
  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService, 
    public emergenciesService: EmergenciesService, private policemansService: PolicemansService, 
    public dialog: MatDialog) {
      authService.getCurrentUserObservable().subscribe(tempPoliceman => {
        this.policeman = tempPoliceman;
      })
      emergenciesService.getEmergensiesMy().subscribe(myEmergencies => {
        console.log("emergencies" +myEmergencies)
        this.myEmergencies = myEmergencies;
        this.myEmergCount = myEmergencies.length;
        this.markers = myEmergencies.map((emergency, index, array) => {
          let marker = new Marker();
          marker.id = emergency.id;
          marker.iconUrl = marker.emergencyIcon;
          marker.info = emergency.info;
          marker.latitude = emergency.latitude;
          marker.longitude = emergency.longitude;
          return marker
        })
        console.log("MARKERS = " + this.markers)
        this.checkLastEmergency();
      })
      emergenciesService.getEmergenciesOther().subscribe(otherEmergencies => {
        this.otherEmergCount = otherEmergencies.length;
      })
  }

  checkLastEmergency() {
    if (this.myEmergencies.length == 0) { 
      this.lastEmergency = new Emergency(); 
      return; 
    }
    this.lastEmergency = this.myEmergencies[0]
    this.myEmergencies.forEach(element => {
      if (this.lastEmergency.timestamp < element.timestamp) {
        this.lastEmergency = element;
      }
    })
    let date = new Date(this.lastEmergency.timestamp*1000)
    this.lastEmergencyRequestTime = date.toLocaleString()
    this.lastEmergencyLatitude = this.lastEmergency.latitude
    this.lastEmergencyLongitude = this.lastEmergency.longitude
    let person = this.policemansService.getPolicemanById(this.lastEmergency.id)
    if (person != undefined) {
      this.lastEmergencyRequestPerson = person.userFirstName + ' ' + person.userLastName
    }
  }
  openWindow(id: number) {
      this.openedWindow = id; // alternative: push to array of numbers
  }
  
  isInfoWindowOpen(id: number) {
      return this.openedWindow == id; // alternative: check if id is in array
  }
  openMarkerDetail(id: string) {
    let emergency = this.myEmergencies.find(element => {
      return element.id == id
    })
    this.openEmergencyDetail(emergency);
  }
  openEmergencyDetail(emergency: Emergency) {
    if (emergency == undefined) { return; }
    const dialogRef = this.dialog.open(EmergencyDetailComponent, 
      { 
        width: '1000px', 
        height: '650px',
        data: emergency
      });
    dialogRef.afterClosed().subscribe(result => { });
  }
  openLastEmergency() {
    if (this.lastEmergency.id != undefined) {
      this.openEmergencyDetail(this.lastEmergency);
    }
  }
}
