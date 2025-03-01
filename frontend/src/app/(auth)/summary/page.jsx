"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TabContent from "../../../components/TabContent";
import { useApi } from "../../../hooks/useApi";

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState("summary");
  const [recentHandover, setRecentHandover] = useState(null);
  const [newSummary, setNewSummary] = useState("");
  const [handovers, setHandovers] = useState([]); // Initialize handovers state

  const {
    data: patientData,
    loading: patientLoading,
    error: patientError,
  } = useApi(`patients/${patientId}`);
  const {
    data: handoversData,
    loading: handoversLoading,
    error: handoversError,
  } = useApi(`handovers/patient/${patientId}`);
  const {
    data: chartData,
    loading: chartLoading,
    error: chartError,
  } = useApi(`charts/patient/${patientId}`);

  // Once handovers are fetched, set the state
  useEffect(() => {
    if (handoversData && handoversData.length > 0) {
      setHandovers(handoversData); // Set the initial handovers
    }
  }, [handoversData]);

  // Once handovers are fetched or updated, pick the most recent one (assumes backend sorts descending)
  useEffect(() => {
    if (handovers && handovers.length > 0) {
      setRecentHandover(handovers[0]);
    }
  }, [handovers]);

  const handleGenerateSummary = async () => {
    if (!chartData || chartData.length === 0) return;

    const chartingData = chartData[0];

    try {
      const response = await fetch("http://localhost:3000/handovers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chartingData),
      });

      if (!response.ok) {
        throw new Error("Failed to create handover summary.");
      }

      const createdHandover = await response.json();
      console.log("Handover summary created:", createdHandover);

      setNewSummary(JSON.stringify(createdHandover.handoverSummary, null, 2));

      // Append the new handover to the existing handovers without overwriting
      setHandovers((prevHandovers) => [createdHandover, ...prevHandovers]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (patientLoading || handoversLoading || chartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Data...
      </div>
    );
  }

  if (patientError || handoversError || chartError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {patientError || handoversError || chartError}
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Patient not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4">
      <nav className="flex gap-4 mb-4">
        <button
          className={`rounded px-3 py-2 ${
            activeTab === "avatar"
              ? "bg-yellow-300 font-semibold"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("avatar")}
        >
          Avatar
        </button>
        <button
          className={`rounded px-3 py-2 ${
            activeTab === "chart"
              ? "bg-yellow-300 font-semibold"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("chart")}
        >
          Chart
        </button>
        <button
          className={`rounded px-3 py-2 ${
            activeTab === "orders"
              ? "bg-yellow-300 font-semibold"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={`rounded px-3 py-2 ${
            activeTab === "summary"
              ? "bg-yellow-300 font-semibold"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </button>
      </nav>

      <div className="flex flex-1 gap-4">
        <aside className="w-1/4 bg-blue-100 p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-5 pb-4 border-b border-blue-200">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold mr-3 shadow-sm">
              {patientData.fullName
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-800">
                {patientData.fullName}
              </h2>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">
              Personal Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">Age:</div>
                <div className="flex-1 font-semibold text-gray-800">
                  {patientData.age}
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">Gender:</div>
                <div className="flex-1 font-semibold text-gray-800">
                  {patientData.gender}
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">
                  Birth Date:
                </div>
                <div className="flex-1 font-semibold text-gray-800">
                  {patientData.dateOfBirth
                    ? new Date(patientData.dateOfBirth).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>

              {patientData.phoneNumber && (
                <div className="flex">
                  <div className="w-24 text-gray-600 font-medium">Phone:</div>
                  <div className="flex-1 font-semibold text-gray-800">
                    {patientData.phoneNumber}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4 pt-3 border-t border-blue-200">
            <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">
              Medical Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">Visit:</div>
                <div className="flex-1 font-semibold text-gray-800">
                  {patientData.visitReason}
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">
                  Blood Type:
                </div>
                <div className="flex-1 font-semibold text-gray-800">
                  {patientData.typeAndScreen?.bloodType || "N/A"}{" "}
                  {patientData.typeAndScreen?.rhFactor}
                  {patientData.typeAndScreen?.antibodiesDetected &&
                    " (Antibodies +)"}
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">Height:</div>
                <div className="flex-1 font-semibold text-gray-800">
                  {patientData.height} cm
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">Weight:</div>
                <div className="flex-1 font-semibold text-gray-800">
                  {patientData.weight} kg
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">BMI:</div>
                <div className="flex-1 font-semibold text-gray-800">
                  {patientData.height && patientData.weight
                    ? (
                        patientData.weight /
                        (patientData.height / 100) ** 2
                      ).toFixed(1)
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {patientData.address && (
            <div className="mb-4 pt-3 border-t border-blue-200">
              <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">
                Address
              </h3>
              <div className="text-sm text-gray-800">
                {patientData.address.street && (
                  <p>{patientData.address.street}</p>
                )}
                {patientData.address.city && patientData.address.state && (
                  <p>
                    {patientData.address.city}, {patientData.address.state}{" "}
                    {patientData.address.postalCode}
                  </p>
                )}
                {patientData.address.country && (
                  <p>{patientData.address.country}</p>
                )}
              </div>
            </div>
          )}
          <div className="mb-4 pt-3 border-t border-blue-200" />
        </aside>

        <main className="flex-1 bg-purple-100 p-4 rounded">
          <TabContent
            activeTab={activeTab}
            patientId={patientId}
            newSummary={newSummary}
            onGenerateSummary={handleGenerateSummary}
            chartData={chartData}
            handovers={handovers} // Pass the updated handovers
          />
        </main>
      </div>
    </div>
  );
}
