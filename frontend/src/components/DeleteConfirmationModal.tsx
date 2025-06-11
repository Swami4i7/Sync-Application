import {
  ResponsiveModal,
  ResponsiveModalTitle,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
} from "@/components/ui/responsive-modal";
import { Button } from "./ui/button";

type DeleteConfirmationModalProps = {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void; 
};

const DeleteConfirmationModal = ({
  message,
  isOpen,
  onClose,
  onDelete,
}: DeleteConfirmationModalProps) => {
  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>{message}</ResponsiveModalTitle>
          <ResponsiveModalDescription aria-describedby="">
            {" "}
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <div className="flex justify-end gap-2">
          <Button onClick={() => onClose()} size={"lg"}>
            Cancel
          </Button>
          <Button
            variant={"destructive"}
            size={"lg"}
            onClick={() => onDelete()}
          >
            Delete
          </Button>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default DeleteConfirmationModal;