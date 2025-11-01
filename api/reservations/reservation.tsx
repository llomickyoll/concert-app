import { apiHandler, ApiResponse } from "@/api/apiService";
import {
  ReservationHistoryResponse,
  ReservationResponse,
} from "@/types/reservation";

const baseUrl = process.env.NEXT_PUBLIC_URL_API;

export const ReservationAPI = {
  getReservations: async (
    userId: number,
  ): Promise<ApiResponse<ReservationResponse>> => {
    return apiHandler<number, ReservationResponse>({
      method: "get",
      url: "reservations",
      baseUrl: baseUrl,
      userId,
    });
  },

  cancelReservation: async (
    userId: number,
    concertId: number,
  ): Promise<ApiResponse<ReservationResponse>> => {
    return apiHandler<void, ReservationResponse>({
      method: "post",
      url: `reservations/${concertId}/cancel`,
      baseUrl: baseUrl,
      userId,
    });
  },

  reserveConcert: async (
    userId: number,
    concertId: number,
  ): Promise<ApiResponse<ReservationResponse>> => {
    return apiHandler<void, ReservationResponse>({
      method: "post",
      url: `reservations/${concertId}/reserve`,
      baseUrl: baseUrl,
      userId,
    });
  },

  getReservationHistory: async (
    userId: number,
  ): Promise<ApiResponse<ReservationHistoryResponse>> => {
    return apiHandler<void, ReservationHistoryResponse>({
      method: "get",
      url: `reservations/history`,
      baseUrl: baseUrl,
      userId,
    });
  },
};
