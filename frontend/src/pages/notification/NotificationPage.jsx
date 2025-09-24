import { useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { IoSettingsOutline, IoNotifications } from "react-icons/io5";
import { FaUser, FaHeart, FaTrash } from "react-icons/fa6";
import { HiSparkles, HiBell } from "react-icons/hi2";
import { BsCheck2All } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../../constant/baseUrl";
import { formatDistanceToNow } from "date-fns";

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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow':
        return <FaUser className='w-6 h-6 text-blue-400' />;
      case 'like':
        return <FaHeart className='w-6 h-6 text-pink-500' />;
      default:
        return <HiBell className='w-6 h-6 text-gray-400' />;
    }
  };

  const getNotificationText = (type) => {
    switch (type) {
      case 'follow':
        return 'started following you';
      case 'like':
        return 'liked your post';
      default:
        return 'sent you a notification';
    }
  };

  return (
    <div className='w-full text-white bg-black'>
      {/* Enhanced Header */}
      <header className='sticky top-0 bg-black/90 backdrop-blur-xl border-b border-gray-700/50 z-10'>
        <div className='flex justify-between items-center px-6 py-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full'>
              <IoNotifications className='w-6 h-6 text-blue-400' />
            </div>
            <div>
              <h1 className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
                Notifications
              </h1>
              <p className='text-sm text-gray-400'>
                {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
              </p>
            </div>
          </div>

          {/* Enhanced Settings Dropdown */}
          <div className='relative'>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className='group p-3 rounded-full hover:bg-gray-800/50 transition-all duration-300'
            >
              <IoSettingsOutline className='w-5 h-5 group-hover:text-blue-400 transition-colors duration-300' />
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className='fixed inset-0 z-10' 
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <div className='absolute right-0 top-full mt-2 bg-gray-900 border border-gray-700 shadow-2xl rounded-xl w-64 py-2 z-20 overflow-hidden'>
                  <div className='px-4 py-2 border-b border-gray-700/50'>
                    <p className='text-sm font-semibold text-gray-300'>Notification Settings</p>
                  </div>
                  <button
                    onClick={() => {
                      deleteNotifications();
                      setDropdownOpen(false);
                    }}
                    className='flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors duration-200'
                  >
                    <FaTrash className='w-4 h-4' />
                    <span className='text-sm font-medium'>Delete all notifications</span>
                  </button>
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className='flex items-center gap-3 w-full px-4 py-3 text-blue-400 hover:bg-blue-500/10 transition-colors duration-200'
                  >
                    <BsCheck2All className='w-4 h-4' />
                    <span className='text-sm font-medium'>Mark all as read</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Enhanced Loading State */}
      {isLoading && (
        <div className='flex flex-col items-center justify-center min-h-96 text-center'>
          <div className='relative'>
            <div className='w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin'></div>
            <div className='absolute inset-0 flex items-center justify-center'>
              <HiSparkles className='w-6 h-6 text-blue-400' />
            </div>
          </div>
          <p className='text-gray-400 mt-4'>Loading your notifications...</p>
        </div>
      )}

      {/* Enhanced Empty State */}
      {!isLoading && notifications.length === 0 && (
        <div className='flex flex-col items-center justify-center min-h-96 text-center px-8'>
          <div className='relative mb-8'>
            <div className='w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center'>
              <HiBell className='w-12 h-12 text-gray-400' />
            </div>
            <div className='absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
              <span className='text-white text-xs font-bold'>0</span>
            </div>
          </div>
          <h2 className='text-2xl font-bold text-white mb-2'>No notifications yet</h2>
          <p className='text-gray-400 max-w-md'>
            When someone follows you or likes your posts, you'll see their notifications here.
          </p>
        </div>
      )}

      {/* Enhanced Notifications List */}
      <div className='px-4 py-2'>
        {notifications.map((notification, index) => (
          <div 
            key={notification._id}
            className='group relative bg-gradient-to-r from-gray-900/20 to-gray-800/10 border border-gray-700/50 rounded-2xl mb-4 overflow-hidden hover:border-gray-600/50 transition-all duration-300'
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Notification glow effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            
            <div className='relative p-6'>
              <div className='flex items-start gap-4'>
                {/* Icon with background */}
                <div className={`p-3 rounded-full ${
                  notification.type === 'follow' 
                    ? 'bg-blue-500/20 border border-blue-500/30' 
                    : 'bg-pink-500/20 border border-pink-500/30'
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between'>
                    <Link 
                      to={`/profile/${notification.from?.username}`} 
                      className='group/profile flex items-center gap-3 min-w-0 flex-1'
                    >
                      {/* Avatar */}
                      <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5'>
                        <img 
                          src={notification.from?.profileImg || notification.from?.profile || "/avatar-placeholder.png"} 
                          alt={`${notification.from?.username}'s avatar`}
                          className='w-full h-full rounded-full object-cover bg-gray-800'
                        />
                      </div>

                      {/* User info and notification text */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='font-bold text-white group-hover/profile:text-blue-400 transition-colors duration-300 truncate'>
                            {notification.from?.firstname || notification.from?.username}
                          </span>
                          <span className='text-gray-400 text-sm truncate'>
                            @{notification.from?.username}
                          </span>
                        </div>
                        <p className='text-gray-300 text-sm'>
                          {getNotificationText(notification.type)}
                        </p>
                      </div>
                    </Link>

                    {/* Timestamp */}
                    <div className='text-right ml-4'>
                      <span className='text-xs text-gray-500'>
                        {notification.createdAt 
                          ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
                          : 'Just now'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Read indicator */}
              {!notification.read && (
                <div className='absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full animate-pulse'></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
