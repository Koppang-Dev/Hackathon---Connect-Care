"use client";
import React, { useState } from "react";
import { useApi } from "../../../hooks/useApi";
import { useRouter } from "next/navigation";

const Home = () => {
  const { data: patients, loading, error } = useApi("patients");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredPatients =
    patients?.filter((patient) =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleSelect = (patientId) => {
    router.push(`/summary?id=${patientId}`);
  };

  console.log("Filtered patients: ", filteredPatients);

  if (loading) return <p className="text-center">Loading patients...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-xl font-bold mb-4 text-center">
          Select a Patient to View Details
        </h1>

        <input
          type="text"
          placeholder="Search patients..."
          className="w-full p-2 border rounded mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="h-80 overflow-y-auto border rounded p-2">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <div
                key={patient._id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>
                  {patient.fullName}, {patient.age} ({patient.gender})
                </span>
                <button
                  onClick={() => handleSelect(patient._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Select
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No patients found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
