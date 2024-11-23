/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/Travel_diary_logo.jpg";
import ProfileInfo from "./Cards/ProfileInfo";

const Navbar = ({ userInfo }) => {
  const isToken = localStorage.getItem("token");

  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <img src={Logo} alt="Travel Diary" className="h-12 w-28" />

      {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
  );
};

export default Navbar;
