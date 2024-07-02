import { useStateProvider } from "../../context/StateContext";
import { GET_UNREAD_MESSAGES, MARK_AS_READ_ROUTE } from "../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function UnreadMessages() {
  const [{ userInfo }] = useStateProvider();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getUnreadMessages = async () => {
      try {
        const response = await axios.get(GET_UNREAD_MESSAGES, {
          withCredentials: true,
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    if (userInfo) {
      getUnreadMessages();
    }
  }, [userInfo]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${MARK_AS_READ_ROUTE}/${id}`, {}, { withCredentials: true });
      const updatedMessages = messages.filter((message) => message.id !== id);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-10">
      {userInfo && (
        <>
          <h3 className="m-5 text-2xl font-semibold">All your Unread Messages</h3>
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Text
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Sender Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Order Id
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{message.text}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{message.sender.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{message.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Link
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            markAsRead(message.id);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Mark as Read
                        </Link>
                        <Link
                          href={`/seller/orders/messages/${message.orderId}`}
                          className="text-blue-600 hover:underline"
                        >
                          View Conversation
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default UnreadMessages;
