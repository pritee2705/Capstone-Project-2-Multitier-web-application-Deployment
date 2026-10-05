export interface Batch {
  id: number;
  startDate: string;
  endDate: string;
  totalInterns: number;
}

export interface BatchRequest {
  startDate: string;
}