export interface UserLocationProps {
  userId: string;
  latitude: number;
  longitude: number;
  updatedAt: Date;
}

export class UserLocationEntity {
  private _userId: string;
  private _latitude: number;
  private _longitude: number;
  private _updatedAt: Date;

  constructor(props: UserLocationProps) {
    this._userId = props.userId;
    this._latitude = props.latitude;
    this._longitude = props.longitude;
    this._updatedAt = props.updatedAt;
  }

  get userId() {
    return this._userId;
  }

  get latitude() {
    return this._latitude;
  }

  get longitude() {
    return this._longitude;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}
