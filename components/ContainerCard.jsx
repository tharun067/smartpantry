"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import WeightHistoryChart from "./WeightHistoryChart";

function ContainerCard({container=[],onUpdateWeight}) {
  const [currentWeight, setCurrentWeight] = useState(container.currentWeight);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();

  const handleWeightUpdate = async () => {
    try {
      const response = await fetch(`/api/containers?containerId=${container._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({containerId:container._id, currentWeight }),
      });
      await onUpdateWeight(container._id, currentWeight);
      setCurrentWeight(currentWeight);
      if (!response.ok) {
        throw new Error("Failed to update weight");
      }
    } catch (error) {
      console.log("Failed to update weight:", error);
    }
  }

  const handleDelete= async () => {
    try {
      await fetch(`/api/containers?containerId=${container._id}`, {
        method:"DELETE",
      })
      router.refresh();
    } catch (error) {
      console.log("Failed to delete container:", error);
    }
  }

  const percentage = Math.round(
    ((container.currentWeight - container.minWeight) / (container.maxWeight - container.minWeight)) * 100
  );

  const getStatusColor = () => {
    if (container.currentWeight <= container.alertWeight) return "bg-red-500";
    if (percentage < 30) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {container.productId.name}
            </h3>
            <p className="text-sm text-gray-600">
              {container.currentWeight} {container.unit}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showHistory ? "Hide History" : "Show History"}
            </button>
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getStatusColor()}`}
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>
              Min: {container.minWeight}
              {container.unit}
            </span>
            <span>
              Max: {container.maxWeight}
              {container.unit}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center">
          <input
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(Number(e.target.value))}
            className="w-20 px-2 py-1 border border-gray-300 rounded-md"
          />
          <span className="ml-2 text-gray-600">{container.unit}</span>
          <button
            onClick={handleWeightUpdate}
            className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Update
          </button>
        </div>

        {showHistory && (
          <div className="mt-4">
            <WeightHistoryChart
              history={container.weightHistory}
              unit={container.unit}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ContainerCard
