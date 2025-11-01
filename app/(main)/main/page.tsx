"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import { addToast } from "@heroui/react";

import { Concert } from "@/types/concert";
import { CardConcert } from "@/components/main/cardConcert";
import { Reservation } from "@/types/reservation";
import { ReservationAPI } from "@/api/reservations/reservation";
import ModalConfirm from "@/components/common/modalConfirm";
import { handleApiResponse } from "@/utils/helper";

export default function Main() {
  const { data: session } = useSession();
  const userId = session?.user?.id as number;
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const fetchReservation = useCallback(async () => {
    if (!userId) return;

    const { response, isError } = await ReservationAPI.getReservations(userId);

    if (isError) {
      setReservations([]);
    } else {
      setReservations(response?.data || []);
    }
  }, [userId]);

  const fetchPublishedConcerts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/published-concerts");
      const data = await res.json();

      setConcerts((data?.response?.data as Concert[]) || []);
    } catch (error) {
      handleApiResponse(
        error as AxiosError<{ message: string }>,
        "Failed to fetch published concerts",
      );
      setConcerts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPublishedConcerts();
  }, [fetchPublishedConcerts]);

  useEffect(() => {
    void fetchReservation();
  }, [fetchReservation]);

  const validateReserve = (concert: Concert) => {
    if (!concert) return false;

    if (concert.capacity === concert.bookingNo) {
      return false;
    }

    if (
      reservations.find((reservation) => reservation.concertId === concert.id)
    ) {
      return false;
    }

    return true;
  };

  const handleReserve = useCallback(
    async (concert: Concert) => {
      if (!concert) return;

      if (!validateReserve(concert)) return;

      try {
        setIsLoading(true);
        await ReservationAPI.reserveConcert(userId, concert.id);
        await Promise.all([fetchReservation(), fetchPublishedConcerts()]);
        addToast({
          title: "Reserve Concert",
          description: "You have successfully reserved the concert",
          color: "success",
        });
      } catch (error) {
        handleApiResponse(
          error as AxiosError<{ message: string }>,
          "Failed to reserve concert",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [userId, fetchReservation, fetchPublishedConcerts, validateReserve],
  );

  const handleButtonAction = useCallback(
    async (concert: Concert, reservation?: Reservation) => {
      if (!userId) return;

      setIsLoading(true);
      try {
        if (reservation) {
          setIsOpen(true);
          setSelectedConcert(concert);
        } else {
          await handleReserve(concert);
        }

        await Promise.all([fetchReservation(), fetchPublishedConcerts()]);
      } catch (error) {
        handleApiResponse(
          error as AxiosError<{ message: string }>,
          "Failed to reserve concert",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [fetchReservation, fetchPublishedConcerts, userId, handleReserve],
  );

  const onClose = useCallback(() => {
    setIsOpen(false);
    setSelectedConcert(null);
  }, []);

  const handleCancel = useCallback(
    async (concert: Concert) => {
      if (!concert) return;

      const { isError, error } = await ReservationAPI.cancelReservation(
        userId,
        concert.id,
      );

      if (isError) {
        handleApiResponse(
          error as AxiosError<{ message: string }>,
          "Failed to cancel reservation",
        );

        return;
      }

      await Promise.all([fetchReservation(), fetchPublishedConcerts()]);
      addToast({
        title: "Cancel Reservation",
        description: "You have successfully canceled the reservation",
        color: "success",
      });
      onClose();
    },
    [userId, onClose, fetchReservation, fetchPublishedConcerts],
  );

  const confirmCallBack = useCallback(async () => {
    if (!selectedConcert) return;

    await handleCancel(selectedConcert);
    onClose();
  }, [selectedConcert, handleButtonAction, onClose]);

  return (
    <section className="grid grid-cols-1 gap-4 w-full">
      {concerts.map((concert, index: number) => {
        const reservation = reservations.find(
          (reservation) => Number(reservation.concertId) === Number(concert.id),
        );

        return (
          <CardConcert
            key={concert.id || index}
            concert={concert}
            index={String(index)}
            isLoading={isLoading}
            reservation={reservation}
            onButtonAction={() =>
              handleButtonAction(concert, reservation as Reservation)
            }
          />
        );
      })}
      <ModalConfirm
        confirmCallBack={confirmCallBack}
        description={`"${selectedConcert?.name}"`}
        isLoading={isLoading}
        isOpen={isOpen}
        title="Are you sure to cancel?"
        type="cancel"
        onClose={onClose}
      />
    </section>
  );
}
