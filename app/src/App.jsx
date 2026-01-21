import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import "./App.css";


export default function App() {
  return (
    <div className="min-h-screen bg-bg p-6 flex flex-col lg:flex-row gap-6">
      <Sidebar />
      <Outlet />
    </div>
  );
}
