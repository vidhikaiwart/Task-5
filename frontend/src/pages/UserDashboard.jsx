import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <h1 className="text-xl font-bold text-slate-900">User Dashboard</h1>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Name</p>
            <p className="text-slate-900 font-medium">{user?.name || "N/A"}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
            <p className="text-slate-900 font-medium">{user?.email || "N/A"}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role</p>
            <p className="text-slate-900 font-medium capitalize">{user?.role || "N/A"}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;