"use client";
import PrivateRoute from "../components/PrivateRoute";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <PrivateRoute>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button onClick={logout} className="mt-4 p-2 bg-red-500 text-white rounded">
          Sair
        </button>
      </div>
    </PrivateRoute>
  );
}