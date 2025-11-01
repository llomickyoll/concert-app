import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { CircleX, Info } from "lucide-react";
import { useCallback } from "react";

interface Props {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  confirmCallBack: () => Promise<void>;
  isLoading?: boolean;
  type: "confirm" | "delete" | "cancel";
}

export default function ModalConfirm({
  isOpen,
  title,
  description,
  onClose,
  confirmCallBack,
  isLoading = false,
  type = "confirm",
}: Props): React.ReactElement {
  const getButtonText = useCallback(() => {
    if (type === "confirm") return "Yes, Confirm";
    if (type === "delete") return "Yes, Delete";
    if (type === "cancel") return "Yes, Cancel";
  }, [type]);

  return (
    <Modal
      hideCloseButton={true}
      isDismissable={false}
      isOpen={isOpen}
      onOpenChange={onClose}
    >
      <ModalContent className="p-2">
        <ModalHeader className="flex flex-col justify-center items-center">
          {type === "confirm" ? (
            <Info className="w-20 h-20" color="white" fill="blue" />
          ) : (
            <CircleX className="w-20 h-20" color="white" fill="#e63846" />
          )}
        </ModalHeader>
        <ModalBody className="text-center flex flex-col gap-2 font-bold text-lg">
          <p>{title}</p>
          <p>{description}</p>
        </ModalBody>
        <ModalFooter className="flex justify-center items-center">
          <Button fullWidth className="rounded-sm" size="lg" onPress={onClose}>
            Cancel
          </Button>
          <Button
            fullWidth
            className={`${
              type === "confirm" ? "bg-blue-500 " : "bg-[#e63846] "
            } text-white rounded-sm`}
            isLoading={isLoading}
            size="lg"
            onPress={() => void confirmCallBack()}
          >
            {getButtonText()}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
