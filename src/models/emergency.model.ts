export class AcceptedPoliceman {
    id: string;
    isAccept: boolean;
}

export class AmbulanceDetail {
    isRequested: boolean;
    isCompleted: boolean;
}

export class Emergency {
    id: string;
    timestamp: number;
    latitude: number;
    longitude: number;
    info: string;
    requestPerson: string;
    ambulanceDetail: AmbulanceDetail;
    acceptedPolicemans?: AcceptedPoliceman[];
}