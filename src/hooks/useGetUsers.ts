import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export const useGetUsers = () => {
  return useQuery(['getUsers'], () =>
    axios.get(`${process.env.REACT_APP_API_URL}/adminrecords/users`, { withCredentials: true })
      .then(response => {
        console.log("users", response.data);
        return response.data;
      })
      .catch(error => {
        console.error("Error fetching users", error);
        // ここでエラー処理を行うか、またはエラーを返す
        throw error;
      })
  );
};

// 環境変数が設定されているかをチェック
if (!process.env.REACT_APP_API_URL) {
  console.error('REACT_APP_API_URL is not set.');
}
