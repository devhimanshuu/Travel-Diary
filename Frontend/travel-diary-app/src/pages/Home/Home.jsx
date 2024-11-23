import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  //get user info

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (!response.data && response.data.user) {
        //set the user info if data is present
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        //redirect to login page if the token is invalid or unauthorized
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />
    </>
  );
};

export default Home;
