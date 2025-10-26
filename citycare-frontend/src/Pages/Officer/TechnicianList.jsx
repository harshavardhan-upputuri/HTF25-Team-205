import React from "react";
import { useAppDispatch } from "../../State/Store";
import { deleteTechnician } from "../../State/Officer/OffTechnicianSlice";

const TechnicianList = ({ technicians }) => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("jwt"); // fixed

  const handleDelete = (id) => {
    if (window.confirm("Delete this technician?")) {
      dispatch(deleteTechnician({ token, id }));
    }
  };

  return (
    <table className="min-w-full bg-white border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Email</th>
          <th className="border px-4 py-2">Phone</th>
          <th className="border px-4 py-2">Skills</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {technicians?.map((tech) => (
          <tr key={tech.id}>
            <td className="border px-4 py-2">{tech.name}</td>
            <td className="border px-4 py-2">{tech.email}</td>
            <td className="border px-4 py-2">{tech.phone}</td>
            <td className="border px-4 py-2">{tech.skills.join(", ")}</td>
            <td className="border px-4 py-2">
              <button
                onClick={() => handleDelete(tech.id)}
                className="bg-red-500 text-white px-2 py-1 rounded-md"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TechnicianList;
