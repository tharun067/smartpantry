"use client";

import AddContainerModal from "@/components/AddContainerModal";
import ContainerCard from "@/components/ContainerCard";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { Link, Package, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Dashboard() {
  const { user } = useAuth();
  const [containers, setContainers] = useState([]);
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user?.householdId) {
      fetchContainers();
    }
  }, [user?.householdId]);

  const fetchContainers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/containers?householdId=${user.householdId}`);
      if (!response.ok) {
        throw new Error(data.statusText);
      }

      const data = await response.json();
      console.log("Fetched containers:", data);
      setContainers(data);
    } catch (error) {
      setError("failed to load containers");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }
  const handleAddContainer = async (containerData) => {
    try {
      setError(null);
      const response = await fetch('/api/containers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(containerData),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      await fetchContainers();
      setIsModelOpen(false);
    } catch (error) {
      setError("Failed to add container");
      console.log("Failed to add container", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="border-b border-gray-300" />
      <div className="flex flex-1">
        <SideBar className="w-64 h-screen fixed top-0 left-0 bg-white shadow-md" />
        <main className="flex-1 ml-64 p-6 bg-white">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              className="flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-all"
              onClick={() => setIsModelOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Container
            </button>
          </div>

          {/* Show loading or error message */}
          {loading ? <p>Loading...</p> : error ? <p>{error}</p> : null}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {containers.length > 0 ? (
              containers.map((container) => (
                <ContainerCard
                  key={container._id}
                  container={container}
                  onUpdateWeight={fetchContainers} // Ensure state updates when weight changes
                />
              ))
            ) : (
              <p>No containers found.</p>
            )}
            {/*<Card className="p-6 bg-gray-50 shadow-lg rounded-lg">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-indigo-100 p-3">
                  <ShoppingListSummary className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Shopping Lists</h3>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
              </div>
            </Card>*/}
          </div>

          <div className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold text-gray-800">Recent Shopping Lists</h2>
            <div className="grid gap-4">
              <Card className="p-6 bg-white shadow-lg rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-700">Weekly Groceries</h3>
                    <p className="text-sm text-gray-500">Created 2 days ago</p>
                  </div>
                  <Link href="/dashboard/shopping-list">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                      View List
                    </button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>

          <AddContainerModal
            isOpen={isModalOpen}
            onClose={() => setIsModelOpen(false)}
            onSubmit={handleAddContainer}
            householdId={user?.householdId}
          />
        </main>
      </div>
    </div>
  );
}

export default Dashboard