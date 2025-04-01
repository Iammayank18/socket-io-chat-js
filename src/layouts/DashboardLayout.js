import Sidebar from "../component/Sidebar";
import { useRouter, usePathname } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const router = usePathname();

  // Show sidebar only for dashboard pages
  const isDashboard = router?.startsWith("/dashboard");
  if (isDashboard) {
    return <Sidebar>{children}</Sidebar>;
  }
  return <>{children}</>;
};

export default DashboardLayout;
