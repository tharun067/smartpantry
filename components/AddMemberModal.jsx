"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";

function AddMembers({ isOpen, onClose, onSubmit }) {
  const [member, setMember] = useState({
    name: "",
    notificationType: "email",
    contactInfo: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({
      ...member,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(member);
    setMember({
      name: "",
      notificationType: "email",
      contactInfo: "",
      password: ""
    });
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Household Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={member.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notification Type</label>
              <select
                name="notificationType"
                value={member.notificationType}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {member.notificationType === "email" ? "Email Address" : "Phone Number"}
              </label>
              <input
                type={member.notificationType === "email" ? "email" : "tel"}
                name="contactInfo"
                value={member.contactInfo}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={member.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMembers;
