import React from "react";
import { usePostClockOutTime } from "../hooks/usePostClockOutTime";
import { ClockOutTime } from "../types";
import "../AttendanceTable.css";
import { Button } from "@chakra-ui/react";
function ClockOutComponent() {
  const { mutate: postClockOutTime } = usePostClockOutTime();

  const handlePostClockOutTime = () => {
    // 現在のUTC時刻をISO 8601形式の文字列として取得
    const currentDate = new Date().toISOString();

    // POSTリクエストのデータに現在時刻を設定
    const clockOutTimeData: ClockOutTime = {
      clock_out_time: currentDate,
    };

    // mutate関数を使用してデータを送信
    postClockOutTime(clockOutTimeData);
  };

  return (
    <div>
      <Button
        colorScheme="green"
        mr={4}
        ml={4}
        onClick={handlePostClockOutTime}
      >
        退勤
      </Button>
    </div>
  );
}

export default ClockOutComponent;
