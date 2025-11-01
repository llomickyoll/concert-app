"use client";

import { Award, CircleX, User } from "lucide-react";
import { Tabs, Tab } from "@heroui/tabs";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import { addToast, Select, SelectItem } from "@heroui/react";
import dayjs from "dayjs";

import { CardAdminHeader } from "@/components/admin/cardHeader";
import { CardCreate } from "@/components/admin/cardCreate";
import { ConcertsAPI } from "@/api/concerts/concert";
import { ConcertCreateRequest, ConcertPublishAll } from "@/types/concert";
import { CardOverview } from "@/components/admin/cardOverview";
import ModalConfirm from "@/components/common/modalConfirm";
import { handleApiResponse } from "@/utils/helper";
import { CardNoData } from "@/components/common/cardNoData";

const ADMIN_CARD_HEADERS = [
  {
    icon: <User className="w-15 h-15" strokeWidth={1} />,
    title: "Total of seats",
    valueKey: "totalCapacity",
    bgColor: "bg-[#0070a4]",
  },
  {
    icon: <Award className="w-15 h-15" strokeWidth={1} />,
    title: "Reserve",
    valueKey: "totalReserved",
    bgColor: "bg-[#02a58a]",
  },
  {
    icon: <CircleX className="w-15 h-15" strokeWidth={1} />,
    title: "Cancel",
    valueKey: "totalCancelled",
    bgColor: "bg-[#e84e4e]",
  },
];

interface AdminCardHerder {
  totalCapacity: number;
  totalReserved: number;
  totalCancelled: number;
}

export default function Admin() {
  const { data: session } = useSession();
  const userId = session?.user?.id as number;
  const [isLoading, setIsLoading] = useState(false);
  const [concerts, setConcerts] = useState<ConcertPublishAll[]>([]);
  const [adminCardHeaders, setAdminCardHeaders] = useState<AdminCardHerder>({
    totalCapacity: 0,
    totalReserved: 0,
    totalCancelled: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConcert, setSelectedConcert] =
    useState<ConcertPublishAll | null>(null);
  const [order, setOrder] = useState<string>("asc");

  const fetchConcerts = useCallback(async () => {
    const { response, isError, error } = await ConcertsAPI.getConcerts();

    if (isError) {
      handleApiResponse(
        error as AxiosError<{ message: string }>,
        "Failed to fetch concerts",
      );
    }
    setConcerts(response?.data?.concerts || []);
    setAdminCardHeaders({
      totalCapacity: response?.data?.totalCapacity || 0,
      totalReserved: response?.data?.totalReserved || 0,
      totalCancelled: response?.data?.totalCancelled || 0,
    });
  }, []);

  useEffect(() => {
    void fetchConcerts();
  }, [fetchConcerts]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    setSelectedConcert(null);
  }, []);

  const handleDelete = useCallback(
    async (concert: ConcertPublishAll) => {
      if (!concert) return;
      setIsLoading(true);
      const { isError, error } = await ConcertsAPI.deleteConcert(
        userId,
        concert.id,
      );

      if (isError) {
        handleApiResponse(
          error as AxiosError<{ message: string }>,
          "Failed to delete concert",
        );
        setIsLoading(false);

        return;
      }
      setIsLoading(false);
      onClose();
      void fetchConcerts();
    },
    [onClose, userId, fetchConcerts],
  );

  const confirmCallBack = useCallback(async () => {
    if (!selectedConcert) return;
    await handleDelete(selectedConcert);
    onClose();
  }, [selectedConcert, handleDelete, onClose]);

  const onDelete = useCallback(async (concert: ConcertPublishAll) => {
    if (!concert) return;
    setIsOpen(true);
    setSelectedConcert(concert);
  }, []);

  const onPublish = useCallback(
    async (concert: ConcertPublishAll) => {
      if (!concert) return;
      setIsLoading(true);
      const { isError, error } = await ConcertsAPI.publishConcert(
        userId,
        concert.id,
        concert.isPublished ? "unpublish" : "publish",
      );

      if (isError) {
        handleApiResponse(
          error as AxiosError<{ message: string }>,
          "Failed to publish concert",
        );
        setIsLoading(false);

        return;
      }
      setIsLoading(false);
      onClose();
      void fetchConcerts();
      addToast({
        title: concert.isPublished ? "Unpublish Concert" : "Publish Concert",
        description: `You have successfully ${concert.isPublished ? "unpublished" : "published"} the concert`,
        color: "success",
      });
    },
    [userId, fetchConcerts, onClose],
  );

  const onCreate = useCallback(
    async (requestData: ConcertCreateRequest) => {
      if (!requestData || !userId) return;

      setIsLoading(true);
      const { isError, error } = await ConcertsAPI.createConcert(
        userId,
        requestData,
      );

      if (isError) {
        handleApiResponse(
          error as AxiosError<{ message: string }>,
          "Failed to create concert",
        );
        setIsLoading(false);

        return;
      }

      setIsLoading(false);
      await fetchConcerts();
      addToast({
        title: "Create Concert",
        description: "You have successfully created the concert",
        color: "success",
      });
    },
    [userId, fetchConcerts],
  );

  const onOrderChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;

      if (value === "asc") {
        setConcerts(
          concerts.sort(
            (a, b) =>
              dayjs(a.createdAt).toDate().getTime() -
              dayjs(b.createdAt).toDate().getTime(),
          ),
        );
      } else {
        setConcerts(
          concerts.sort(
            (a, b) =>
              dayjs(b.createdAt).toDate().getTime() -
              dayjs(a.createdAt).toDate().getTime(),
          ),
        );
      }
      setOrder(value);
    },
    [concerts],
  );

  return (
    <section className="flex flex-col w-full items-center justify-center gap-4 py-8 md:py-10">
      <div className="flex flex-row w-full flex-wrap gap-4 justify-center items-center">
        {ADMIN_CARD_HEADERS.map((header, index) => {
          const value = Number(
            adminCardHeaders[header.valueKey as keyof AdminCardHerder] || 0,
          );

          return (
            <CardAdminHeader
              key={`card-admin-header-${index.toString()}`}
              concerts={concerts}
              index={index.toString()}
              {...header}
              value={value}
            />
          );
        })}
      </div>
      <div className="w-full">
        <Tabs
          fullWidth
          classNames={{
            tabList: "gap-6 w-full relative",
            cursor: "bg-[#1392ec] left-0 right-0",
            tab: "max-w-fit px-0 h-12 text-lg",
            tabContent:
              "group-data-[selected=true]:text-[#1392ec] group-data-[selected=true]:font-bold",
          }}
          color="primary"
          size="lg"
          variant="underlined"
        >
          <Tab key="overview" title="Overview">
            <div className="flex flex-col w-full gap-4">
              <div className="flex w-full items-center justify-end gap-4">
                <Select
                  className="max-w-xs"
                  disallowEmptySelection={true}
                  items={[
                    { label: "Latest created date", value: "asc" },
                    { label: "Oldest created date", value: "desc" },
                  ]}
                  label="Order by"
                  labelPlacement="outside-left"
                  name="order"
                  selectedKeys={order ? [order] : []}
                  variant="bordered"
                  onChange={onOrderChange}
                >
                  <SelectItem key="asc">Oldest created date</SelectItem>
                  <SelectItem key="desc">Latest created date</SelectItem>
                </Select>
              </div>
              <div className="flex flex-col w-full gap-4">
                {concerts.map((concert, index) => (
                  <CardOverview
                    key={`card-overview-${concert.id}`}
                    concert={concert}
                    index={String(index)}
                    isLoading={false}
                    onDelete={onDelete}
                    onPublish={onPublish}
                  />
                ))}
                {concerts.length === 0 && <CardNoData />}
              </div>
            </div>
          </Tab>
          <Tab key="Create" title="Create">
            <CardCreate onCreate={onCreate} />
          </Tab>
        </Tabs>
      </div>
      <ModalConfirm
        confirmCallBack={confirmCallBack}
        description={`"${selectedConcert?.name}"`}
        isLoading={isLoading}
        isOpen={isOpen}
        title="Are you sure to delete?"
        type="delete"
        onClose={onClose}
      />
    </section>
  );
}
