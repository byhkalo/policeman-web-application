export class Marker {
    id: string;
    latitude: number;
    longitude: number;
    info: string;
    policeIcon: string = "https://www.iconshock.com/image/RealVista/people/policeman/"
    emergencyIcon: string = "https://www.seton.net/wp-content/uploads/sites/2/2014/04/emergency-icon.png"
    iconUrl: string = this.emergencyIcon;
}