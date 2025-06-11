"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users } from "../../../types/users";
import { DataTable } from "@/components/DataTable";
import { deleteUser } from "@/app/actions/user/users";
import CreateUsersModal from "@/components/client/users/CreateUser";
import EditUsersModal from "@/components/client/users/EditUser";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useSession } from "next-auth/react";
import { useBoolean } from "@/hooks/useBoolean";
import { encryptBody, processError } from "@/lib/utils";
import { getUsersColumns } from "@/app/(protected)/users/columns";
import Searchbar from "@/components/Searchbar";
import { useRouter } from "next/navigation";

interface ColumnOption {
  accessorKey: string;
  header: string;
}

interface UsersViewProps {
  data: Users[];
  totalPages: number;
  pageCount: number;
}

const UsersView = ({
  data: initialData,
  totalPages,
  pageCount,
}: UsersViewProps) => {
  const {
    value: isCreateModalOpen,
    onTrue: openCreateModal,
    onFalse: closeCreateModal,
  } = useBoolean(false);

  const {
    value: isEditModalOpen,
    onTrue: openEditModal,
    onFalse: closeEditModal,
  } = useBoolean(false);

  const {
    value: isDeleteModalOpen,
    onTrue: openDeleteModal,
    onFalse: closeDeleteModal,
  } = useBoolean(false);

  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const router = useRouter();
  const { data: sessionData } = useSession();
  const currentUserId = sessionData?.user?.id;

  const handleEditUser = useCallback(
    (user: Users) => {
      setSelectedUser(user);
      openEditModal();
    },
    [openEditModal]
  );

  const handleDeleteUser = useCallback(
    (user: Users) => {
      setSelectedUser(user);
      openDeleteModal();
    },
    [openDeleteModal]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedUser) return;

    if (currentUserId && Number(currentUserId) === selectedUser.USER_ID) {
      toast.error("You cannot delete your own account.");
      return;
    }

    try {
      const user=selectedUser.USER_ID.toString();
      const data= {user_id:user.toString()} 
      const body = JSON.stringify(data);
      const { ciphertext, iv } = encryptBody(body);
      const encryptedBody = JSON.stringify({ ciphertext, iv });
      await deleteUser(encryptedBody,selectedUser.USER_ID);
      toast.success("User deleted successfully");
      closeDeleteModal();
      router.refresh();
      router.refresh();
    } catch (error) {
      const errorMessage = processError(error);
      toast.error(errorMessage || "Error deleting user");
    }
  }, [selectedUser, currentUserId, closeDeleteModal, router]);

  const columns = getUsersColumns(handleEditUser, handleDeleteUser);

  const searchableColumns = useMemo<ColumnOption[]>(() => {
    return columns
      .filter((col) => {
        const accessor = (col as ColumnOption).accessorKey;
        return (
          typeof accessor === "string" &&
          (col as ColumnOption).header !== "actions"
        );
      })
      .map((col) => ({
        accessorKey: (col as ColumnOption).accessorKey,
        header: (col as ColumnOption).header,
      }));
  }, [columns]);

  const handleUpdateUser = useCallback(() => {
    closeEditModal();
    router.refresh();
  }, [closeEditModal, router]);

  const handleCreateUser = useCallback(() => {
    closeCreateModal();
    router.refresh();
  }, [closeCreateModal, router]);

  return (
    <>
      <div className="flex flex-col md:flex-row mb-4 items-center justify-between gap-2">
        <Searchbar columns={searchableColumns} />
        <Button
          onClick={openCreateModal}
          variant="default"
          className="w-full md:w-auto"
        >
          Add User
        </Button>
      </div>
      <DataTable
        data={initialData}
        columns={columns}
        totalPages={totalPages}
        pageCount={pageCount}
        pagination={true}
      />
      {isCreateModalOpen && (
        <CreateUsersModal
          isOpen={isCreateModalOpen}
          onClose={handleCreateUser}
          message="Create New User"
        />
      )}
      {isEditModalOpen && selectedUser && (
        <EditUsersModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          userData={selectedUser}
          onEdit={handleUpdateUser}
          message={"Update User Details"}
        />
      )}
      {isDeleteModalOpen && selectedUser && (
        <DeleteConfirmationModal
          onDelete={handleConfirmDelete}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          message={`Are you sure you want to delete ${selectedUser.USER_NAME}?`}
        />
      )}
    </>
  );
};

export default UsersView;
