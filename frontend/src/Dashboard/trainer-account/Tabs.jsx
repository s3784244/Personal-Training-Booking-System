import { useContext } from "react";
import { BiMenu } from "react-icons/bi";
import { authContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // ADD THIS IMPORT
import { toast } from "react-toastify"; // ADD THIS IMPORT
import { BASE_URL } from "../../config"; // ADD THIS IMPORT

const Tabs = ({ tab, setTab }) => {
  const { dispatch, user } = useContext(authContext);
  const navigate = useNavigate(); // ADD THIS LINE

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  // ADD THIS FUNCTION
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your trainer account? This action cannot be undone and will remove all your bookings."
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${BASE_URL}trainers/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      toast.success("Trainer account deleted successfully");
      dispatch({ type: "LOGOUT" });
      navigate('/');
    } catch (err) {
      toast.error(err.message || "Failed to delete account");
    }
  };

  return (
    <div>
      <span className="lg:hidden">
        <BiMenu className="w-6 h-6 cursor-pointer" />
      </span>
      <div className="hidden lg:flex flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md">
        <button
          onClick={() => setTab("overview")}
          className={`${
            tab === "overview"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          } w-full btn mt-0 rounded-md`}
        >
          Overview
        </button>
        <button
          onClick={() => setTab("bookings")}
          className={`${
            tab === "bookings"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          } w-full btn mt-0 rounded-md`}
        >
          Bookings
        </button>
        <button
          onClick={() => setTab("settings")}
          className={`${
            tab === "settings"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          } w-full btn mt-0 rounded-md`}
        >
          Settings
        </button>
        <button
          onClick={() => setTab("profile")}
          className={`${
            tab === "profile"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          } w-full btn mt-0 rounded-md`}
        >
          Profile
        </button>

        <div className="mt-[100px] w-full">
          <button onClick={handleLogout} className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white">
            Logout
          </button>
          {/* UPDATE THIS LINE - ADD onClick={handleDeleteAccount} */}
          <button 
            onClick={handleDeleteAccount}
            className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white hover:bg-red-700 transition-colors"
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tabs;