"use client";

import { Card, CardBody } from "@heroui/card";
import { Music2 } from "lucide-react";

export const CardNoData = () => {
  return (
    <Card
      key="card-no-data"
      fullWidth
      className="p-8 border border-[#c9c9c9]"
      shadow="none"
    >
      <CardBody className="flex flex-col items-center justify-center w-full gap-4 py-8">
        <Music2 className="w-16 h-16 text-default-300" />
        <p className="text-2xl font-bold text-default-500">No concerts found</p>
        <p className="text-sm text-default-400 text-center">
          There are no published concerts available at the moment.
        </p>
      </CardBody>
    </Card>
  );
};
