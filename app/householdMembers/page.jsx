"use client";

import AddMembers from "@/components/AddMemberModal";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiUserPlus } from "react-icons/fi";

function MembersPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.householdId) {
      fetchMembers();
    }
  }, [user]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/households/members?householdId=${user.householdId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      setError("Failed to load members");
      console.error("Fetch members error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (memberData) => {
    try {
      await fetch('/api/households/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ householdId: user.householdId, ...memberData }),
      });

      await fetchMembers();
      setIsModalOpen(false);
    } catch (error) {
      setError("Failed to add member");
      console.error("Add member error:", error);
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      await fetch('/api/households/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      });

      await fetchMembers();
    } catch (error) {
      setError("Failed to remove member");
      console.error("Remove member error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Household Members</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <FiUserPlus className="mr-2" />
          Add Member
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notification</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.length > 0 ? (
              members.map((member) => (
                <tr key={member._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.contactInfo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {member.notificationType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDeleteMember(member._id)}
                      className="text-red-600 hover:text-red-900 mr-4"
                    >
                      <FiTrash2 />
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <FiEdit />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddMembers
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddMember}
      />
    </div>
  );
}

export default MembersPage;
