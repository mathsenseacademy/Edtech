import { Outlet } from "react-router-dom";
import TopInfoBar from "../components/TopInfoBar/TopInfoBar";
import Header     from "../components/Header/Header";
import Footer     from "../components/Footer/Footer";
import useLocoScroll from "../hooks/useLocoScroll";

export default function NonAdminLayout() {
  // keep locoScroll enabled
  const { scrollRef } = useLocoScroll(true);

  return (
    <div data-scroll-container ref={scrollRef}>
      {/* always show TopInfoBar and Header */}
      <TopInfoBar />
      <Header />

      {/* your page content */}
      <div data-scroll-section className="pt-header">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
