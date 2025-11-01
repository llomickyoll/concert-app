import { apiHandler, ApiResponse } from "@/api/apiService";
import {
  ConcertAllResponse,
  ConcertCreateRequest,
  ConcertResponse,
} from "@/types/concert";

const baseUrl = process.env.NEXT_PUBLIC_URL_API;

export const ConcertsAPI = {
  getConcerts: async (): Promise<ApiResponse<ConcertAllResponse>> => {
    return apiHandler<void, ConcertAllResponse>({
      method: "get",
      url: "concerts",
      baseUrl,
    });
  },
  getPublishedConcerts: async (): Promise<ApiResponse<ConcertResponse>> => {
    return apiHandler<void, ConcertResponse>({
      method: "get",
      url: "concerts/published",
    });
  },
  deleteConcert: async (
    userId: number,
    concertId: number,
  ): Promise<ApiResponse<ConcertResponse>> => {
    return apiHandler<void, ConcertResponse>({
      method: "delete",
      url: `concerts/${concertId}`,
      baseUrl,
      userId,
    });
  },
  publishConcert: async (
    userId: number,
    concertId: number,
    status: string,
  ): Promise<ApiResponse<ConcertResponse>> => {
    return apiHandler<void, ConcertResponse>({
      method: "put",
      url: `concerts/${concertId}/${status}`,
      baseUrl,
      userId,
    });
  },
  createConcert: async (
    userId: number,
    requestData: ConcertCreateRequest,
  ): Promise<ApiResponse<ConcertResponse>> => {
    return apiHandler<ConcertCreateRequest, ConcertResponse>({
      method: "post",
      url: "concerts",
      baseUrl,
      userId,
      requestData,
    });
  },
};
