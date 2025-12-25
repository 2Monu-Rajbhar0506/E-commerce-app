import React from "react";
import UserMenu from "../components/UserMenu";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  return (
    <section className="bg-[#eef3f8] min-h-screen w-full">
      <div className="flex">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex flex-col bg-white shadow-sm border-r w-[260px]  sticky top-22 max-h-[calc(100vh-96px)] p-4">
          <UserMenu />
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main className="flex-1 p-4">
          <div className="bg-white border rounded-lg shadow-sm p-4 min-h-[80vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};

export default Dashboard;
