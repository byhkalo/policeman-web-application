import { Component, OnInit, Inject } from '@angular/core';
import { Marker } from 'src/models/marker.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.css']
})
export class MapDetailComponent implements OnInit {

  marker: Marker

  constructor(@Inject(MAT_DIALOG_DATA) public data: Marker, public dialogRef: MatDialogRef<MapDetailComponent>) { 
    this.marker = data;
  }

  ngOnInit() { }

  closeMap() {
    this.dialogRef.close(true);
  }
}
