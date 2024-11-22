/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="flex items-center bg-cyan-600/5 px-5 
      rounded mb-3"
    >
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        type={showPassword ? "text" : "password"}
        className="w-full text-sm bg-transparent py-3 mr-3 
          rounded outline-none"
      />
      {showPassword ? (
        <FaRegEye
          size={22}
          className="text-cyan-600 cursor-pointer"
          onClick={() => {
            toggleShowPassword();
          }}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-slate-400 cursor-pointer"
          onClick={() => {
            toggleShowPassword();
          }}
        />
      )}
    </div>
  );
};
export default PasswordInput;
