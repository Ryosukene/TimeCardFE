import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { User } from '../types'
import { useToast } from '@chakra-ui/react';
export const usePostCreateUser = () => {
  const toast = useToast()
  const postCreateUser = async (userData:User) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/create-user`, 
       userData,
      { withCredentials: true }
    );
    return response.data;
  };
  return useMutation(postCreateUser, {
    onSuccess: () => {
      toast({
        title: '登録成功',
        description: 'ユーザー登録が完了しました。',
        status: 'success',
        duration: 3000, 
        isClosable: true,
      });
    },
    onError: (err: any) => {
      toast({
        title: '登録失敗',
        description: err.response.data,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};
