"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import {
  Calendar,
  MapPin,
  Ticket,
  TicketCheck,
  Trash,
  User,
} from "lucide-react";
import { Button } from "@heroui/button";
import dayjs from "dayjs";
import { Tooltip } from "@heroui/tooltip";
import { Switch } from "@heroui/react";

import { DATE_FORMAT } from "@/constants/main";
import { ConcertPublishAll } from "@/types/concert";
import { Reservation } from "@/types/reservation";

interface CardOverviewProps {
  index: string;
  concert: ConcertPublishAll;
  reservation?: Reservation;
  onDelete: (concert: ConcertPublishAll) => void;
  onPublish: (concert: ConcertPublishAll) => void;
  isLoading: boolean;
}

export const CardOverview = ({
  index,
  concert,
  onDelete,
  onPublish,
}: CardOverviewProps) => {
  const seatAvailable =
    Number(concert.capacity) - Number(concert?.bookingNo || 0);

  return (
    <Card
      key={`card-concert-${index}`}
      fullWidth
      className="p-4 border border-[#c9c9c9]"
      shadow="none"
    >
      <CardHeader className="w-full border-b border-[#c9c9c9]">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-col items-start w-full justify-start gap-4">
            <p className="text-4xl text-[#1692EC]">{concert.name}</p>
          </div>
          <Switch
            color="primary"
            isSelected={concert.isPublished}
            onValueChange={() => {
              onPublish(concert);
            }}
          >
            Publish
          </Switch>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col items-start w-full justify-start gap-2">
          <div className="flex flex-row flex-wrap gap-4 justify-between w-full">
            <div className="flex flex-row gap-2 items-center">
              <Tooltip content="Date available">
                <Calendar className="w-4 h-4" color="gray" />
              </Tooltip>
              <p className="text-sm text-gray-500">{`${dayjs(concert.startDate).format(DATE_FORMAT)} - ${dayjs(concert.endDate).format(DATE_FORMAT)}`}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Tooltip content="Location">
                <MapPin className="w-4 h-4" color="blue" />
              </Tooltip>
              <p className="text-sm text-gray-500">{concert.location}</p>
            </div>
          </div>
          <p>{concert.description}</p>
        </div>
      </CardBody>
      <CardFooter>
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center w-full">
          <div className="flex flex-row flex-wrap gap-4 justify-start">
            <div className="flex flex-row gap-2 items-center">
              <Tooltip content="Seat Total">
                <User className="w-4 h-4 flex-shrink-0" />
              </Tooltip>
              <p className="text-sm">{concert.capacity}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Tooltip content="Seat Available">
                <Ticket className="w-4 h-4 flex-shrink-0" color="green" />
              </Tooltip>
              <p className="text-sm">{seatAvailable}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Tooltip content="Seat Reserved">
                <TicketCheck className="w-4 h-4 flex-shrink-0" color="red" />
              </Tooltip>
              <p className="text-sm">{concert?.bookingNo || 0}</p>
            </div>
          </div>
          <Button
            className="w-full sm:w-auto flex-shrink-0 rounded-sm"
            color="danger"
            onPress={() => onDelete(concert)}
          >
            <Trash className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
