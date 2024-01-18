import React, { useState } from "react";
import { useGetUsers } from "../hooks/useGetUsers";
import "../Modal.css";
import { Button } from "@chakra-ui/react";

// Update the User type to ensure the id is renderable
type User = {
  id: string | number; // Use a type that can be rendered as a ReactNode
  name: string;
  email: string;
  department: string;
};

const AuthGetUsers = () => {
  const { data, error, isLoading } = useGetUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  //   if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Button colorScheme="green" onClick={() => setIsModalOpen(true)}>
        社員リスト
      </Button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content" style={{ borderRadius: "10px" }}>
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <div>
              {data?.map((user: User) => (
                <div key={user.id} className="user-details">
                  <div>ID: {user.id.toString()}</div>{" "}
                  {/* Ensure id is a string */}
                  <div>名前: {user.name}</div>
                  <div>メール: {user.email}</div>
                  <div>部門: {user.department}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthGetUsers;
