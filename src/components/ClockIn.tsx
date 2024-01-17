import React from "react";
import { usePostClockInTime } from "../hooks/usePostClockInTime";
import { ClockInTime } from "../types";
import "../AttendanceTable.css";
function ClockInComponent() {
  const { mutate: postClockInTime } = usePostClockInTime();

  const handlePostClockInTime = () => {
    // 現在のUTC時刻をISO 8601形式の文字列として取得
    const currentDate = new Date().toISOString();

    // POSTリクエストのデータに現在時刻を設定
    const clockInTimeData: ClockInTime = {
      clock_in_time: currentDate,
    };

    // mutate関数を使用してデータを送信
    postClockInTime(clockInTimeData);
  };

  return (
    <div className="clock-in-container">
      <button onClick={handlePostClockInTime}>出勤</button>
    </div>
  );
}

export default ClockInComponent;
