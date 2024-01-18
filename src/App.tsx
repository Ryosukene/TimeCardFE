import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Auth } from "./components/Auth";
import axios from "axios";
import { CsrfToken } from "./types";
import Table from "./components/Table";
import AttendanceTableByDate from "./components/Admin";
import CreateUser from "./components/CreateUser";
import { ChakraProvider } from "@chakra-ui/react";
function App() {
  useEffect(() => {
    axios.defaults.withCredentials = true;
    const getCsrfToken = async () => {
      const { data } = await axios.get<CsrfToken>(
        `${process.env.REACT_APP_API_URL}/csrf`
      );
      axios.defaults.headers.common["X-CSRF-Token"] = data.csrf_token;
    };
    getCsrfToken();
  }, []);
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/table" element={<Table />} />
          <Route path="admin" element={<AttendanceTableByDate />} />
          <Route path="CreateUser" element={<CreateUser />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
