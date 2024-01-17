import React from "react";
import { useAuthGetTable } from "../hooks/useAuthGetTable";
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
interface AttendanceRecord {
  user_id: number;
  user_name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
}

const createAttendanceRecordsFromJson = (jsonData: any): AttendanceRecord[] => {
  console.log("jsonData1", jsonData);

  const attendanceRecords: AttendanceRecord[] = [];
  for (const key in jsonData) {
    console.log("key", key);
    console.log("jsonData[key]", jsonData[key]);

    const data = jsonData[key];
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
    const attendanceRecord = {
      user_id: data.user_id,
      user_name: data.user.name,
      date: checkInDate,
      checkIn: checkInTime,
      checkOut: checkOutTime,
      hoursWorked,
    };
    attendanceRecords.push(attendanceRecord);
  }
  return attendanceRecords;
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

const AuthGetTable = ({
  date,
  department,
}: {
  date: string;
  department: string;
}) => {
  const { data, isLoading, error } = useAuthGetTable(date, department);

  interface RecordType {
    id: number;
    user_id: number;
    clock_in_time: string;
    clock_out_time: string;
    created_at: string;
  }
  if (!data) {
    return <div>No data available</div>;
  }

  const earliestRecordsById = data.reduce(
    (acc: Record<string, RecordType>, record: RecordType) => {
      // 既に同じuser_idのレコードが存在し、そのidが現在のレコードのidより小さい場合は無視
      if (acc[record.user_id] && acc[record.user_id].id < record.id) {
        return acc;
      }
      // それ以外の場合は、現在のレコードを累積オブジェクトに追加
      acc[record.user_id] = record;
      return acc;
    },
    {}
  );

  console.log(earliestRecordsById);
  if (isLoading) return <div>Loading...</div>;

  const attendanceRecords =
    createAttendanceRecordsFromJson(earliestRecordsById);

  console.log("attendanceRecords", attendanceRecords);
  return (
    <div className="attendance-table-container">
      <table>
        <tbody>
          <tr>
            <th>名前</th>
            <th>出社時間</th>
            <th>退社時間</th>
            <th>勤務時間</th>
          </tr>
          {Object.values(attendanceRecords).map((record, index) => (
            <tr key={index}>
              <td>{record.user_name}</td>
              {/* <td>{record.date}</td> */}
              <td>{record.checkIn || "---"}</td>
              <td>{record.checkOut || "---"}</td>
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
                    {record.hoursWorked > 0 && (
                      <span className="time-bar-text">
                        {record.hoursWorked}h
                      </span>
                    )}
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

export default AuthGetTable;
