import { FaTimes } from "react-icons/fa";

const ProfileModal = ({ show, onClose, onLogout, user }) => {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[1100]"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 w-[320px] max-w-[92%] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 z-[1110]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-600 hover:text-gray-800"
        >
          <FaTimes />
        </button>

        {/* Header */}
        <div className="text-center">
          <img
            src={user?.avatar}
            alt="avatar"
            className="w-[90px] h-[90px] rounded-full object-cover mx-auto mb-2 cursor-pointer"
          />
          <h2 className="text-lg font-semibold">{user?.name}</h2>
          <p className="text-sm text-gray-500 m-0">{user?.username}</p>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>

        {/* Password form */}
        <form className="flex flex-col gap-2 mt-4">
          <input
            type="password"
            placeholder="New password"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </form>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="w-full py-2 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700 mt-3"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default ProfileModal;
