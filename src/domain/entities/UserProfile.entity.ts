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

/**
 * UserProfileEntity ahora es una interface simple, sin lógica interna.
 */
export interface UserProfileEntity {
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
