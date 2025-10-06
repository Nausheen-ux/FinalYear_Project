import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandlordRegister() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[90%] max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Property Owner Registration
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* <div>
            <label className="block font-medium text-gray-700">
              Property Name
            </label>
            <input
              type="text"
              placeholder="Enter property name"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div> */}

          <div>
            <label className="block font-medium text-gray-700">
              Upload Identity Proof (Any Goverment Identity) (image or PDF)
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full border border-green-600 text-green-600 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}
