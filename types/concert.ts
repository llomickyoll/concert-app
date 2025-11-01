export interface ConcertResponse {
  data: ConcertPublish;
  message: string;
  status: number;
  isError: boolean;
}

export interface Concert {
  id: number;
  name: string;
  description: string;
  capacity: number;
  location: string;
  organizer: string;
  startDate: Date;
  endDate: Date;
  bookingNo: number;
}

export interface ConcertCreateRequest {
  name: string;
  description: string;
  capacity: number;
  location: string;
  organizer?: string;
  startDate: string;
  endDate: string;
}

export interface ConcertPublish {
  id: number;
  name: string;
  description: string;
  capacity: number;
  location: string;
  organizer: string;
  startDate: Date;
  endDate: Date;
  bookingNo: number;
}

export interface ConcertAllResponse {
  data: ConcertAllItem;
  message: string;
  status: number;
  isError: boolean;
}

export interface ConcertPublishAll extends ConcertPublish {
  isPublished: boolean;
  createdAt: Date;
  cancelledNo: number;
}

export interface ConcertAllItem {
  concerts: ConcertPublishAll[];
  totalCapacity: number;
  totalReserved: number;
  totalCancelled: number;
}
