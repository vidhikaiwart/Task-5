import { useSelector } from "react-redux";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  console.log("User role:", user?.role); // Debug log

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
};

export default Dashboard;
