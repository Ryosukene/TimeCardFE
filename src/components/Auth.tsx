import { useState, FormEvent } from "react";
import { ArrowPathIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useMutateAuth } from "../hooks/useMutateAuth";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthUser, setIsAuthUser] = useState(false);
  const {
    loginMutation,
    registerMutation,
    authLoginMutation,
    authRegisterMutation,
  } = useMutateAuth();

  const submitAuthHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      const loginAction = isAuthUser ? authLoginMutation : loginMutation;
      loginAction.mutate({
        email: email,
        password: pw,
      });
    } else {
      if (isAuthUser) {
        await authRegisterMutation.mutateAsync({
          email: email,
          password: pw,
        });
      } else {
        await loginMutation
          .mutateAsync({
            email: email,
            password: pw,
          })
          .then(() =>
            loginMutation.mutate({
              email: email,
              password: pw,
            })
          );
      }
    }
  };
  console.log("isAuthUser", isAuthUser);
  console.log("isLogin", isLogin);
  return (
    <div className="flex justify-center items-center min-h-screen text-gray-600 font-mono">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center text-3xl font-extrabold mb-4">
          出退勤管理アプリ
        </div>
        <div>
          <div className="flex flex-col justify-center items-center w-full">
            {isAuthUser && (
              <h2 className="my-3 text-center">
                {isLogin ? "ログイン" : "新しいアカウントを作成"}
              </h2>
            )}
          </div>
          <div className="flex justify-center items-center mb-2">
            <UserCircleIcon
              onClick={() => setIsAuthUser(!isAuthUser)}
              className={`h-5 w-5 text-${
                isAuthUser ? "green" : "gray"
              }-500 cursor-pointer mr-2`}
            />
            <div>
              {isAuthUser
                ? "社員用ログインに切り替える"
                : "管理者用ログインに切り替える"}
            </div>
          </div>
          <form onSubmit={submitAuthHandler}>
            <div>
              <input
                className="mb-2 px-3 text-sm py-2 border border-gray-300 w-full"
                name="email"
                type="email"
                autoFocus
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div>
              <input
                className="mb-2 px-3 text-sm py-2 border border-gray-300 w-full"
                name="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setPw(e.target.value)}
                value={pw}
              />
            </div>
            <div className="flex justify-center w-full">
              <button
                className="disabled:opacity-40 py-2 px-4 rounded text-white bg-indigo-600 mx-auto"
                disabled={!email || !pw}
                type="submit"
              >
                {isAuthUser
                  ? isLogin
                    ? "ログイン"
                    : "登録"
                  : isLogin
                  ? "ログイン"
                  : "ログイン"}

                {/* {isAuthUser && !isLogin ? "登録" : "ログイン"} */}
              </button>
            </div>
          </form>
          <div className="flex flex-col justify-center items-center w-full">
            {!isAuthUser ? null : (
              <ArrowPathIcon
                onClick={() => setIsLogin(!isLogin)}
                className="h-6 w-6 mt-2 text-blue-500 cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
