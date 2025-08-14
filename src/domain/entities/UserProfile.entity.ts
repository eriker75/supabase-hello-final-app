export interface UserProfileProps {
  id: string;
  userId: string;
  name: string;
  email: string;
  alias?: string;
  biography?: string;
  birthDate?: Date;
  gender?: number;
  genderInterests?: string[];
  avatar?: string;
  secondaryImages?: string[];
  address?: string;
  lastOnline?: Date;
  latitude?: number;
  longitude?: number;
  isOnboarded: boolean;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferences?: {
    minAge: number;
    maxAge: number;
    maxDistance: number;
    genders: string[];
  };
}

export class UserProfileEntity {
  private _id: string;
  private _userId: string;
  private _name: string;
  private _email: string;
  private _alias?: string;
  private _biography?: string;
  private _birthDate?: Date;
  private _gender?: number;
  private _genderInterests?: string[];
  private _avatar?: string;
  private _secondaryImages?: string[];
  private _address?: string;
  private _lastOnline?: Date;
  private _latitude?: number;
  private _longitude?: number;
  private _isOnboarded: boolean;
  private _isActive: boolean;
  private _isVerified: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _preferences?: {
    minAge: number;
    maxAge: number;
    maxDistance: number;
    genders: string[];
  };

  constructor(props: UserProfileProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._name = props.name;
    this._email = props.email;
    this._alias = props.alias;
    this._biography = props.biography;
    this._birthDate = props.birthDate;
    this._gender = props.gender;
    this._genderInterests = props.genderInterests;
    this._avatar = props.avatar;
    this._secondaryImages = props.secondaryImages;
    this._address = props.address;
    this._lastOnline = props.lastOnline;
    this._latitude = props.latitude;
    this._longitude = props.longitude;
    this._isOnboarded = props.isOnboarded;
    this._isActive = props.isActive;
    this._isVerified = props.isVerified;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._preferences = props.preferences;
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get alias() {
    return this._alias;
  }

  get biography() {
    return this._biography;
  }

  get birthDate() {
    return this._birthDate;
  }

  get gender() {
    return this._gender;
  }

  get genderInterests() {
    return this._genderInterests;
  }

  get avatar() {
    return this._avatar;
  }

  get secondaryImages() {
    return this._secondaryImages;
  }

  get address() {
    return this._address;
  }

  get lastOnline() {
    return this._lastOnline;
  }

  get latitude() {
    return this._latitude;
  }

  get longitude() {
    return this._longitude;
  }

  get isOnboarded() {
    return this._isOnboarded;
  }

  get isActive() {
    return this._isActive;
  }

  get isVerified() {
    return this._isVerified;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get preferences() {
    return this._preferences;
  }
}
