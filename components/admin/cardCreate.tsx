"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Textarea,
  Input,
  Button,
  DateRangePicker,
  RangeValue,
} from "@heroui/react";
import { Save, User } from "lucide-react";
import { DateValue, getLocalTimeZone, today } from "@internationalized/date";
import { useCallback, useState } from "react";
import dayjs from "dayjs";

import { ConcertCreateRequest } from "@/types/concert";

interface CardCreateProps {
  onCreate: (requestData: ConcertCreateRequest) => void;
}

interface ConcertCreateFormData {
  name: string;
  description: string;
  capacity?: number;
  location: string;
  organizer?: string;
  dateRange: RangeValue<DateValue> | null;
}

interface ConcertCreateFormErrors {
  name: string;
  description: string;
  capacity: string;
  location: string;
  dateRange: string;
}

export const CardCreate = ({ onCreate }: CardCreateProps) => {
  const [requestData, setRequestData] = useState<ConcertCreateFormData>({
    name: "",
    description: "",
    location: "",
    dateRange: null as RangeValue<DateValue> | null,
  });
  const [errors, setErrors] = useState<ConcertCreateFormErrors>({
    name: "",
    description: "",
    capacity: "",
    location: "",
    dateRange: "",
  });

  const resetRequestData = useCallback(() => {
    setRequestData({
      name: "",
      description: "",
      capacity: undefined,
      location: "",
      dateRange: null,
    });
    setErrors({
      name: "",
      description: "",
      capacity: "",
      location: "",
      dateRange: "",
    });
  }, []);

  const validateRequestData = useCallback(() => {
    if (!requestData.name.trim()) {
      setErrors((prev) => ({
        ...prev,
        name: "Name is required",
      }));

      return false;
    }
    if (!requestData.capacity || requestData.capacity <= 0) {
      setErrors((prev) => ({
        ...prev,
        capacity: "Capacity must be greater than 0",
      }));

      return false;
    }
    if (!requestData.description.trim()) {
      setErrors((prev) => ({
        ...prev,
        description: "Description is required",
      }));

      return false;
    }
    if (!requestData.location.trim()) {
      setErrors((prev) => ({
        ...prev,
        location: "Location is required",
      }));

      return false;
    }
    if (!requestData.dateRange) {
      setErrors((prev) => ({
        ...prev,
        dateRange: "Date range is required",
      }));

      return false;
    }

    return true;
  }, [requestData]);

  const handleCreate = useCallback(async () => {
    if (!validateRequestData()) {
      return;
    }
    const concertRequestData: ConcertCreateRequest = {
      ...requestData,
      capacity: Number(requestData.capacity),
      startDate: dayjs(
        requestData.dateRange?.start.toDate(getLocalTimeZone()),
      ).format("YYYY-MM-DD"),
      endDate: dayjs(
        requestData.dateRange?.end.toDate(getLocalTimeZone()),
      ).format("YYYY-MM-DD"),
    };

    await onCreate(concertRequestData);
    resetRequestData();
  }, [onCreate, requestData, resetRequestData, validateRequestData]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setRequestData((prev) => ({
        ...prev,
        [name]:
          name === "capacity"
            ? value && !isNaN(Number(value))
              ? Number(value)
              : undefined
            : value,
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    },
    [],
  );

  const handleChangeDate = useCallback(
    (value: RangeValue<DateValue> | null) => {
      setRequestData((prev) => ({
        ...prev,
        dateRange: value,
      }));

      setErrors((prev) => ({
        ...prev,
        dateRange: "",
      }));
    },
    [],
  );

  return (
    <Card
      key={`card-create`}
      className={`p-4 border  border-[#c9c9c9]`}
      shadow="none"
    >
      <CardHeader className="w-full">
        <div className="flex flex-col items-start w-full justify-start gap-4">
          <div className="flex flex-row items-center w-full justify-between gap-2">
            <p className="text-4xl text-[#1692EC]">Create</p>
            <Button
              className="rounded-sm text-white"
              color="danger"
              radius="sm"
              onPress={resetRequestData}
            >
              Clear
            </Button>
          </div>

          <hr className="my-2 w-full border-t border-[#c9c9c9]" />
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col items-center w-full justify-center gap-2">
          <div className="flex sm:flex-row flex-col items-top w-full justify-center gap-2">
            <Input
              classNames={{
                inputWrapper: "rounded-sm border-black border-1",
                label: "text-md",
              }}
              errorMessage={errors.name}
              isInvalid={!!errors.name}
              label="Concert Name"
              labelPlacement="outside-top"
              name="name"
              placeholder="Please input concert name"
              radius="sm"
              value={requestData.name}
              variant="bordered"
              onChange={handleChange}
            />
            <Input
              classNames={{
                inputWrapper: "rounded-sm border-black border-1",
                label: "text-md",
              }}
              endContent={<User className="w-4 h-4" />}
              errorMessage={errors.capacity}
              isInvalid={!!errors.capacity}
              label="Total of seats"
              labelPlacement="outside-top"
              name="capacity"
              placeholder="Please input total of seats"
              radius="sm"
              type="number"
              value={requestData.capacity?.toString() || ""}
              variant="bordered"
              onChange={handleChange}
            />
          </div>
          <div className="flex sm:flex-row flex-col  items-top w-full justify-center gap-2">
            <Textarea
              classNames={{
                inputWrapper: "rounded-sm border-black border-1",
                label: "text-md",
              }}
              errorMessage={errors.description}
              isInvalid={!!errors.description}
              label="Description"
              labelPlacement="outside"
              name="description"
              placeholder="Please input description"
              radius="sm"
              value={requestData.description}
              variant="bordered"
              onChange={handleChange}
            />
          </div>
          <div className="flex sm:flex-row flex-col  items-top w-full justify-center gap-2">
            <Input
              classNames={{
                inputWrapper: "rounded-sm border-black border-1",
                label: "text-md",
              }}
              errorMessage={errors.location}
              isInvalid={!!errors.location}
              label="Location"
              labelPlacement="outside-top"
              name="location"
              placeholder="Please input location"
              radius="sm"
              value={requestData.location}
              variant="bordered"
              onChange={handleChange}
            />
            <DateRangePicker
              classNames={{
                inputWrapper: "rounded-sm border-black border-1",
                label: "text-md",
              }}
              errorMessage={errors.dateRange}
              isInvalid={!!errors.dateRange}
              label="Reserve Date"
              labelPlacement="outside"
              minValue={today(getLocalTimeZone())}
              name="dateRange"
              radius="sm"
              value={requestData.dateRange}
              variant="bordered"
              onChange={handleChangeDate}
            />
          </div>
        </div>
      </CardBody>
      <CardFooter>
        <div className="flex flex-row items-center w-full justify-end gap-2">
          <Button
            className="rounded-sm"
            color="primary"
            radius="sm"
            onPress={handleCreate}
          >
            <Save className="w-4 h-4" /> Save
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
