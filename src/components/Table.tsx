import { useState, useEffect } from "react";
import axios from "axios";
import "../AttendanceTable.css";
import { useMutateAuth } from "../hooks/useMutateAuth";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import ClockInComponent from "./ClockIn";
import ClockOutComponent from "./ClockOut";

// ISO 8601形式の日時文字列からDateオブジェクトを作成し、日付と時刻を抽出する関数
const parseDateTime = (isoString: string | number | Date) => {
  const dateObj = new Date(isoString);
  const date = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
  const time = dateObj.toTimeString().substr(0, 5);
  return { date, time };
};

// 出勤時間と退勤時間の差分から勤務時間を計算する関数
const calculateHoursWorked = (
  clockInTime: string | number | Date,
  clockOutTime: string | number | Date
) => {
  const inTime = new Date(clockInTime);
  const outTime = new Date(clockOutTime);
  const diffMs = outTime.getTime() - inTime.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.round(diffHours * 100) / 100;
};

// JSONデータから勤務記録の配列を生成する関数
const createAttendanceRecordsFromJson = (jsonData: any[]) => {
  return jsonData.map((data) => {
    const { date: checkInDate, time: checkInTime } = parseDateTime(
      data.clock_in_time
    );
    const { date: checkOutDate, time: checkOutTime } = parseDateTime(
      data.clock_out_time
    );
    const hoursWorked = calculateHoursWorked(
      data.clock_in_time,
      data.clock_out_time
    );

    return {
      date: checkInDate,
      checkIn: checkInTime,
      checkOut: checkOutTime,
      hoursWorked,
    };
  });
};

// 現在の月の日数を取得する関数
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// 初期勤怠記録を生成する関数
const createInitialAttendanceRecords = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  return Array.from({ length: daysInMonth }, (_, i) => ({
    date: `${currentMonth + 1}/${i + 1}`,
    checkIn: "",
    checkOut: "",
    hoursWorked: 0,
  }));
};

// 時間バーのスタイルを計算する関数
const calculateBarStyles = (
  checkInTime: string,
  checkOutTime: string,
  hoursWorked: number
) => {
  if (
    !checkInTime ||
    !checkOutTime ||
    hoursWorked <= 0 ||
    checkInTime > checkOutTime
  ) {
    return { marginLeft: "0%", width: "0%" };
  }

  const [checkInHours, checkInMinutes] = checkInTime.split(":").map(Number);
  const [checkOutHours, checkOutMinutes] = checkOutTime.split(":").map(Number);
  const totalHours = 24;
  const start = ((checkInHours + checkInMinutes / 60) / totalHours) * 100;
  const end = ((checkOutHours + checkOutMinutes / 60) / totalHours) * 100;
  const width = end - start;

  return { marginLeft: `${start + 5}%`, width: `${width}%` };
};

const AttendanceTable = () => {
  const [records, setRecords] = useState(createInitialAttendanceRecords());
  const queryClient = useQueryClient();
  const { logoutMutation } = useMutateAuth();
  const logout = async () => {
    await logoutMutation.mutateAsync();
    queryClient.removeQueries(["tasks"]);
  };
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/attendance-records`
        );
        const transformedRecords = createAttendanceRecordsFromJson(
          response.data
        );
        setRecords((currentRecords) => {
          return currentRecords.map((record) => {
            // APIから取得したデータに同じ日付のレコードがあるか確認
            const updatedRecord = transformedRecords.find(
              (transformedRecord) => transformedRecord.date === record.date
            );

            // 更新するべきレコードが見つかり、かつ hoursWorked が 0 より大きい場合のみ更新
            if (updatedRecord && updatedRecord.hoursWorked > 0) {
              return updatedRecord;
            } else if (updatedRecord && updatedRecord.checkIn) {
              updatedRecord.hoursWorked = 0;
              updatedRecord.checkOut = "";
              return updatedRecord;
            }
            // hoursWorked が 0 以下の場合、退社時間は更新しない
            return record;
          });
        });
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };
    fetchAttendanceRecords();
  }, []);

  console.log(records);
  return (
    <div className="attendance-table-container">
      <div className="flex">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <ClockInComponent />
          <ClockOutComponent />
        </div>
        <ArrowRightOnRectangleIcon
          onClick={logout}
          className="h-6 w-6 my-6 text-blue-500 cursor-pointer"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>出社時間</th>
            <th>退社時間</th>
            <th>
              <div className="hours-above-bar">
                {Array.from({ length: 24 }).map((_, hour) => (
                  <span key={hour} className="hour-mark">
                    {hour}
                  </span>
                ))}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.checkIn}</td>
              <td>{record.checkOut}</td>
              <td className="time-bar-cell">
                <div className="time-bar-container">
                  <div
                    className="time-bar"
                    style={calculateBarStyles(
                      record.checkIn,
                      record.checkOut,
                      record.hoursWorked
                    )}
                  >
                    <span className="time-bar-text">{record.hoursWorked}h</span>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
