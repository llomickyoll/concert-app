export interface ReservationResponse {
  data: Reservation[];
  message: string;
  status: number;
  isError: boolean;
}

export interface Reservation {
  id: number;
  concertId: number;
  status: string;
}

export interface ReservationHistoryResponse {
  data: ReservationHistory[];
  message: string;
  status: number;
  isError: boolean;
}

export interface ReservationHistory {
  dateTime: Date;
  concertName: string;
  userName: string;
  status: string;
}
