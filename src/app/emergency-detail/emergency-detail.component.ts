import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Emergency, AmbulanceDetail } from 'src/models/emergency.model';
import { EmergenciesService } from 'src/services/emergensies.service';
import { PolicemansService } from 'src/services/policemans.service';
import { NotificationService } from 'src/services/notification.service';
import { Policeman } from 'src/models/policeman.model';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-emergency-detail',
  templateUrl: './emergency-detail.component.html',
  styleUrls: ['./emergency-detail.component.css']
})
export class EmergencyDetailComponent implements OnInit {
  emergency: Emergency

  latitude: number;
  longitude: number;
  requestTime: string;
  additionalInfo: string; 
  requestPerson: string;
  isRequestedAmbulance: boolean;

  cityLatitude = 50.061650;
  cityLongitude = 19.938444;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Emergency, private emergenciesService: EmergenciesService, 
  private policemansService: PolicemansService, public dialogRef: MatDialogRef<EmergencyDetailComponent>,
  private notificationService: NotificationService, private authService: AuthService) { 
    this.emergency = data
    this.latitude = this.emergency.latitude;
    this.longitude = this.emergency.longitude;
    let date = new Date(this.emergency.timestamp);
    this.requestTime = date.toLocaleString();
    this.additionalInfo = this.emergency.info;
    let person = this.policemansService.getPolicemanById(this.emergency.requestPerson) 
    if (person == null) {
      this.requestPerson = "Admin"
    } else {
      this.requestPerson = person.userFirstName + " " + person.userLastName
    }
    this.cityLatitude = this.latitude;
    this.cityLongitude = this.longitude;
    this.isRequestedAmbulance = this.emergency.ambulanceDetail.isRequested
  }

  ngOnInit() { }

  requestAmbulance() {
    this.isRequestedAmbulance = true
    this.emergenciesService.setRequestAmbulanceEmergency(this.emergency, true);
  }
  updateEmergency() {
    let ambulanceDetail: AmbulanceDetail = this.emergency.ambulanceDetail
    ambulanceDetail.isRequested = this.isRequestedAmbulance
    this.emergenciesService
    .updateEmergency(this.emergency, this.latitude, this.longitude, this.additionalInfo, 
      this.emergency.requestPerson, ambulanceDetail, this.emergency.acceptedPolicemans)
    this.dialogRef.close(true);
  }
  closeEmergency() {
    this.dialogRef.close(true);
  }
}
