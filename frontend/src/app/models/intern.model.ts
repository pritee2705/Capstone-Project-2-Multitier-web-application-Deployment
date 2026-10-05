export type IdCardType = 'FREE' | 'PREMIUM';

export interface Intern {
  id: number;
  internId: string;
  name: string;
  email: string;
  mobileNumber: string;
  idCardType: IdCardType;
  dateOfJoining: string;
  batchId: number;
  batchStartDate: string;
  batchEndDate: string;
}

export interface InternRequest {
  name: string;
  email: string;
  mobileNumber: string;
  idCardType: IdCardType;
  dateOfJoining: string;
  batchId: number;
}

export interface InternUpdateRequest {
  name: string;
  email: string;
  mobileNumber: string;
}