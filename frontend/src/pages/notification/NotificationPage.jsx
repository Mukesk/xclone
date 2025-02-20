import { useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../../constant/baseUrl";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/notification`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });

        return Array.isArray(res.data) ? res.data : []; // Ensure always an array
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
      }
    },
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      if (!window.confirm("Are you sure you want to delete all notifications?")) return;
      await axios.delete(`${baseUrl}/api/notification`, { withCredentials: true });
    },
    onSuccess: () => {
      alert("All notifications deleted successfully!");
      queryClient.invalidateQueries(["notification"]);
    },
    onError: (error) => {
      alert(`Failed to delete notifications: ${error.message}`);
    },
  });

  return (
    <div className='flex-[4_4_0] text-white border-l border-r border-gray-700 min-h-screen'>
      {/* Header */}
      <div className='flex justify-between items-center p-4 border-b border-gray-700'>
        <p className='font-bold'>Notifications</p>

        {/* Dropdown Wrapper */}
        <div className='relative'>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className='p-2 rounded-full hover:bg-gray-700'>
            <IoSettingsOutline className='w-5 h-5' />
          </button>

          {dropdownOpen && (
            <ul className='absolute right-0 top-10 bg-gray-800 shadow-lg rounded-lg w-52 p-2'>
              <li>
                <button
                  onClick={() => {
                    deleteNotifications();
                    setDropdownOpen(false);
                  }}
                  className='block w-full text-left px-4 py-2 hover:bg-gray-700'
                >
                  Delete all notifications
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className='flex justify-center h-full items-center'>
          <LoadingSpinner size='lg' />
        </div>
      )}

      {/* No Notifications Message */}
      {!isLoading && notifications.length === 0 && (
        <div className='text-center p-4 font-bold'>No notifications 🤔</div>
      )}

      {/* Notifications List */}
      {notifications.map((notification) => (
        <div className='border-b border-gray-700' key={notification._id}>
          <div className='flex gap-2 p-4'>
            {notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
            {notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
            <Link to={`/profile/${notification.from?.username}`} className='flex gap-2 items-center'>
              <div className='avatar'>
                <div className='w-8 rounded-full'>
                  <img src={notification.from?.profileImg || "/avatar-placeholder.png"} alt="Profile" />
                </div>
              </div>
              <div className='flex gap-1'>
                <span className='font-bold'>@{notification.from?.username}</span>{" "}
                {notification.type === "follow" ? "followed you" : "liked your post"}
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPage;
