import React, { useState } from "react";
import { User } from "../types";
import { usePostCreateUser } from "../hooks/usePostCreateUser";
import "../Modal.css";
import { Button } from "@chakra-ui/react";
function CreateUserModal() {
  const { mutate: postCreateUser } = usePostCreateUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePostCreateUser = () => {
    const userData: User = {
      name: name,
      email: email,
      password: password,
      department: department,
    };
    postCreateUser(userData);
    setIsModalOpen(false); // ユーザー作成後にモーダルを閉じる
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <Button colorScheme="blue" onClick={() => setIsModalOpen(true)}>
        社員の登録
      </Button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content bg-white rounded-lg p-6 shadow-lg relative">
            <span
              className="close absolute top-0 right-0.5 m-0.1 cursor-pointer text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </span>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="name"
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border rounded-md"
              />
              <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="department"
                onChange={(e) => setDepartment(e.target.value)}
                className="px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={handlePostCreateUser}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateUserModal;
