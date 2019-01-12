import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { MyEmergensiesDataSource, MyEmergensiesTableDS } from './my-emergensies-datasource';
import { EmergenciesService } from 'src/services/emergensies.service';
import { Emergency } from 'src/models/emergency.model';
import { EmergencyDetailComponent } from '../emergency-detail/emergency-detail.component';
import { Marker } from 'src/models/marker.model';
import { MapDetailComponent } from '../map-detail/map-detail.component';

@Component({
  selector: 'app-my-emergensies',
  templateUrl: './my-emergensies.component.html',
  styleUrls: ['./my-emergensies.component.css']
})
export class MyEmergensiesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MyEmergensiesTableDS;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['latlong', 'time', 'info', 'isRequestedAmbulance', 'map'];

  constructor(public dialog: MatDialog, private emergenciesService: EmergenciesService) {}

  ngOnInit() {
    this.dataSource = new MyEmergensiesTableDS([], this.paginator, this.sort);
    this.emergenciesService.getEmergensiesMy().subscribe(emergenciesAll => {
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
  selectRow(row: Emergency) {
    const dialogRef = this.dialog.open(EmergencyDetailComponent, 
      { 
        width: '1000px', 
        height: '650px',
        data: row
      });
    
    dialogRef.afterClosed().subscribe(result => { });
  }
  requestAmbulance(row: Emergency) {
    this.emergenciesService.setRequestAmbulanceEmergency(row, true);
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
