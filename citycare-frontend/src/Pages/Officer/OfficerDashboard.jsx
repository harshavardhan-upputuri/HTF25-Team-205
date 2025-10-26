import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import { fetchTechnicians } from "../../State/Officer/OffTechnicianSlice";
import TechnicianList from "./TechnicianList";

const OfficerDashboard = () => {
  const dispatch = useAppDispatch();
  const { technicians, loading } = useAppSelector((state) => state.offtechnician);
  const token = localStorage.getItem("jwt"); // fixed

  useEffect(() => {
    if (token) {
      dispatch(fetchTechnicians(token));
    }
  }, [dispatch, token]);

  if (loading) return <p>Loading technicians...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Officer Dashboard</h1>
      <TechnicianList technicians={technicians || []} />
    </div>
  );
};

export default OfficerDashboard;
