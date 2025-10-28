import AdvanceSidebar from "../AdvanceSidebar";
import { Header } from "../header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <AdvanceSidebar>
      <Header />
      {children}
    </AdvanceSidebar>
  );
};

export default MainLayout;
