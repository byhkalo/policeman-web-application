import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { OtherEmergensiesDataSource, OtherEmergensiesTableDS } from './other-emergensies-datasource';
import { EmergenciesService } from 'src/services/emergensies.service';
import { MapDetailComponent } from '../map-detail/map-detail.component';
import { Marker } from 'src/models/marker.model';
import { Emergency } from 'src/models/emergency.model';
import { EmergencyDetailComponent } from '../emergency-detail/emergency-detail.component';
import { AuthService } from 'src/services/auth.service';
import { Policeman } from 'src/models/policeman.model';

@Component({
  selector: 'app-other-emergensies',
  templateUrl: './other-emergensies.component.html',
  styleUrls: ['./other-emergensies.component.css']
})
export class OtherEmergensiesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  dataSource: OtherEmergensiesTableDS;

  policeman: Policeman | null
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['latlong', 'time', 'info', 'isRequestedAmbulance', 'acceptEmergency', 'map'];

  constructor(public dialog: MatDialog, private emergenciesService: EmergenciesService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUserObservable().subscribe(tempPoliceman => {
      if (tempPoliceman == undefined) { return }
      this.policeman = tempPoliceman;
    })
    this.dataSource = new OtherEmergensiesTableDS([], this.paginator, this.sort);
    this.emergenciesService.getEmergenciesOther().subscribe(emergenciesAll => {
      this.dataSource.data = emergenciesAll;
    });
  }
  dateTime(timestamp: number): string {
    let date = new Date(timestamp*1000)
    return date.toLocaleString()
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  acceptEmergency(row: Emergency) {
    if (this.policeman != null) {
      this.emergenciesService.acceptPolicemanToEmergency(row, this.policeman)
    }
  }
  showOnMap(row: Emergency) {
    let marker = new Marker()
    marker.id = row.id;
    marker.info = row.info;
    marker.latitude = row.latitude;
    marker.longitude = row.longitude;
    marker.iconUrl = marker.emergencyIcon
    const dialogRef = this.dialog.open(MapDetailComponent, 
      { 
        width: '800px', 
        height: '650px',
        data: marker
      });
    
    dialogRef.afterClosed().subscribe(result => { });
  }
}
