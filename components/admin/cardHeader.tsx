"use client";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { useCallback } from "react";

import { ConcertPublishAll } from "@/types/concert";

interface CardAdminHeaderProps {
  index: string;
  icon: React.ReactNode;
  title: string;
  value: number;
  bgColor: string;
  concerts: ConcertPublishAll[];
}

const TITLE_TO_VALUE_KEY: Record<string, keyof ConcertPublishAll> = {
  "Total of seats": "capacity",
  Reserve: "bookingNo",
  Cancel: "cancelledNo",
};

export const CardAdminHeader = ({
  index,
  icon,
  title,
  value,
  bgColor,
  concerts,
}: CardAdminHeaderProps) => {
  const getValueByTitle = useCallback(
    (concert: ConcertPublishAll): number => {
      const key = TITLE_TO_VALUE_KEY[title];

      return key ? (concert[key] as number) : 0;
    },
    [title],
  );

  const handleTooltip = useCallback(() => {
    return (
      <div className="flex flex-col items-start w-full justify-start gap-2 p-2">
        <p className="text-md font-bold">{title}</p>
        {concerts.map((concert) => {
          const concertValue = getValueByTitle(concert);

          return (
            <div key={concert.id} className="grid grid-cols-2 gap-2 w-full">
              <p className="text-md text-left">{concert.name}</p>
              <p className="text-md text-right">{concertValue}</p>
            </div>
          );
        })}
      </div>
    );
  }, [concerts, getValueByTitle]);

  return (
    <Tooltip content={handleTooltip()}>
      <Card
        key={`card-admin-header-${index}`}
        className={`p-4 border ${bgColor} text-white min-w-sm`}
        shadow="none"
      >
        <CardHeader className="w-full">
          <div className="flex flex-col items-center w-full justify-center gap-4">
            {icon}
            <p className="text-2xl">{title}</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col items-center w-full justify-center gap-2">
            <p className="text-4xl font-bold">{value}</p>
          </div>
        </CardBody>
      </Card>
    </Tooltip>
  );
};
