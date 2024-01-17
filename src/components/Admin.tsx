import React, { useState, useEffect } from "react";
import axios from "axios";
import "../AttendanceTable.css";
import CreateUser from "./CreateUser";
import { useMutateAuth } from "../hooks/useMutateAuth";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import AuthGetTable from "./AuthGetTable";
import AuthGetUsers from "./AuthGetUsers";
const AttendanceTableByDate = () => {
  const [records, setRecords] = useState(null);
  const [date, setDate] = useState("0000-01-01");
  const [department, setDepartment] = useState("");
  const [showTable, setShowTable] = useState(false);
  const { logoutMutation } = useMutateAuth();
  const queryClient = useQueryClient();
  const logout = async () => {
    await logoutMutation.mutateAsync();
    queryClient.removeQueries(["tasks"]);
  };
  const handleButtonClick = () => {
    setShowTable(true); // showTableをtrueに設定してコンポーネントを表示
  };

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/attendance-records/date/${date}`
        );
        console.log("date", date);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };
    fetchAttendanceRecords();
  }, [date]);

  console.log(records);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex">
        <div className="flex space-x-4">
          <CreateUser />
          <AuthGetUsers />
        </div>

        <ArrowRightOnRectangleIcon
          onClick={logout}
          className="h-6 w-6 my-6 text-blue-500 cursor-pointer"
        />
      </div>

      <table className="w-full table-auto border-collapse bg-white shadow-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="p-3 text-left">日付</th>
            <th className="p-3 text-left">部署</th>
            <th></th>
          </tr>
          <tr>
            <td className="p-3 text-left">
              <input
                type="date"
                className="border border-gray-300 p-2 rounded-lg w-full"
                onChange={(e) => setDate(e.target.value)}
              />
            </td>
            <td className="p-3 text-left">
              <input
                type="text"
                className="border border-gray-300
p-2 rounded-lg w-full"
                onChange={(e) => setDepartment(e.target.value)}
              />
            </td>
            <td className="p-3 text-left">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleButtonClick}
              >
                検索
              </button>
            </td>
          </tr>
        </thead>
      </table>
      {showTable && <AuthGetTable date={date} department={department} />}
    </div>
  );
};

export default AttendanceTableByDate;
