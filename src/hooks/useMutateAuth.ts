import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import useStore from '../store'
import { Credential } from '../types'
import { useError } from './useError'
import { useToast } from '@chakra-ui/react';
export const useMutateAuth = () => {
  const navigate = useNavigate()
  const resetEditedTask = useStore((state) => state.resetEditedTask)
  const { switchErrorHandling } = useError()
  const toast = useToast()
  const loginMutation = useMutation(
    async (user: Credential) =>
      await axios.post(`${process.env.REACT_APP_API_URL}/login`, user),
    {
      onSuccess: () => {
        navigate('/table')
      },
      onError: (err: any) => {
        toast({
          title: 'ログイン失敗',
          description: err.response.data,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });     
      },
    }
  )
  const authLoginMutation = useMutation(
    async (user: Credential) => 
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, user),
    {
      onSuccess: () => {
        navigate('/admin') 
      },
      onError: (err: any) => {
        toast({
          title: 'ログイン失敗',
          description: err.response.data,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });     
       },
    }
  )

  const registerMutation = useMutation(
    async (user: Credential) =>
      await axios.post(`${process.env.REACT_APP_API_URL}/signup`, user),
    {
      onError: (err: any) => {
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    }
  )
 
  const authRegisterMutation = useMutation(
    async (user: Credential) => 
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, user),
    {
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
    }
  );
  
  const authLogoutMutation = useMutation(
    async () => await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`),
    {
      onSuccess: () => {
        resetEditedTask()
        navigate('/') 
      },
      onError: (err: any) => {
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    }
  )
  const logoutMutation = useMutation(
    async () => await axios.post(`${process.env.REACT_APP_API_URL}/logout`),
    {
      onSuccess: () => {
        resetEditedTask()
        navigate('/')
      },
      onError: (err: any) => {
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    }
  )
  return {     loginMutation, 
    registerMutation, 
    logoutMutation,
    authLoginMutation,
    authRegisterMutation,
    authLogoutMutation }
}

