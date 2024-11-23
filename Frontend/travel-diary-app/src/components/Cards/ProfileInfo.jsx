import { getIntials } from "../../utils/helper";
import PropTypes from "prop-types";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    userInfo && (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
          {getIntials(userInfo ? userInfo.fullName : "")}
        </div>
        <div>
          <p className="text-sm font-medium ">{userInfo.fullName || ""}</p>
          <button
            className="text-sm text-slate-700 underline"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};
ProfileInfo.propTypes = {
  userInfo: PropTypes.shape({
    fullName: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
};

export default ProfileInfo;
