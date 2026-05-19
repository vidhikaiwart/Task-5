import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/users");
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Toggle user role
  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole === "admin" ? "user" : "admin";
    if (userId === currentUser.id) {
      toast.error("You cannot change your own role!");
      return;
    }

    try {
      setActionUserId(userId);
      const response = await api.put(`/auth/users/${userId}/role`, { role: nextRole });
      toast.success(response.data?.message || "User role updated successfully");
      
      // Update locally
      setUsers(users.map(u => u._id === userId ? { ...u, role: nextRole } : u));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle role");
    } finally {
      setActionUserId(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (userId === currentUser.id) {
      toast.error("You cannot delete yourself!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      setActionUserId(userId);
      const response = await api.delete(`/auth/users/${userId}`);
      toast.success(response.data?.message || "User deleted successfully");
      
      // Filter out locally
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col justify-between p-6 border-r border-slate-800">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3 text-white">
            <div className="grid grid-cols-2 gap-1 w-6 h-6 shrink-0">
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
            </div>
            <span className="font-bold text-lg tracking-tight">Authentication system</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-indigo-600 text-white shadow-md shadow-indigo-600/15">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>User Management</span>
            </button>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              {currentUser?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{currentUser?.name || "Admin Name"}</p>
              <p className="text-xs text-indigo-400 font-semibold truncate capitalize">{currentUser?.role || "Admin"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Console</h1>
          <div className="flex items-center space-x-4">
            <div className="md:hidden">
              <button
                onClick={handleLogout}
                className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                Log Out
              </button>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-600">
              {currentUser?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 md:p-8 max-w-6xl w-full mx-auto space-y-8 flex-1">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
            <div className="space-y-2 z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Admin Control Room
              </h2>
              <p className="text-slate-300 text-sm max-w-md">
                Manage registered user accounts, edit permissions, and monitor roles in real-time.
              </p>
            </div>
            <div className="z-10 bg-slate-800/80 border border-slate-700/50 backdrop-blur-md px-5 py-3 rounded-2xl text-center">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</p>
              <p className="text-2xl font-black text-white">{users.length}</p>
            </div>
          </div>

          {/* User Management Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">User Accounts</h3>
              <button 
                onClick={fetchUsers}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors flex items-center space-x-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
                </svg>
                <span>Refresh List</span>
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-400">Loading user directory...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                No users found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-3.5">User Name</th>
                      <th className="px-6 py-3.5">Email Address</th>
                      <th className="px-6 py-3.5">Role</th>
                      <th className="px-6 py-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {users.map((userObj) => (
                      <tr key={userObj._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                              {userObj.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <span className="font-semibold text-slate-900">
                              {userObj.name} {userObj._id === currentUser.id && <span className="text-xs text-indigo-600 bg-indigo-50 font-normal px-2 py-0.5 rounded-full ml-1.5 border border-indigo-100">You</span>}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{userObj.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            userObj.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-indigo-50 text-indigo-700"
                          }`}>
                            {userObj.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {userObj.role !== "admin" && (
                              <>
                                <button
                                  onClick={() => handleToggleRole(userObj._id, userObj.role)}
                                  disabled={actionUserId === userObj._id}
                                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-40 transition-colors"
                                >
                                  Promote to Admin
                                </button>
                                <span className="text-slate-200">|</span>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteUser(userObj._id)}
                              disabled={userObj._id === currentUser.id || actionUserId === userObj._id}
                              className="text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
