import { useStateProvider } from "../../../context/StateContext";
import { GET_SELLER_ORDERS_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [{ userInfo }] = useStateProvider();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const {
          data: { orders },
        } = await axios.get(GET_SELLER_ORDERS_ROUTE, { withCredentials: true });
        setOrders(orders);
      } catch (err) {
        console.error(err);
      }
    };
    if (userInfo) getOrders();
  }, [userInfo]);

  return (
    <div className="p-4 md:p-8">
      <h3 className="text-2xl font-semibold">All your Orders</h3>
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Order Id</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Delivery Time</th>
              <th className="px-4 py-3">Ordered By</th>
              <th className="px-4 py-3">Order Date</th>
              <th className="px-4 py-3">Send Message</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50"
              >
                <td className="px-4 py-3">{order.id}</td>
                <td className="px-4 py-3">{order.gig.title}</td>
                <td className="px-4 py-3">{order.gig.category}</td>
                <td className="px-4 py-3">{order.price}</td>
                <td className="px-4 py-3">{order.gig.deliveryTime}</td>
                <td className="px-4 py-3">
                  {order.buyer.fullName} ({order.buyer.username})
                </td>
                <td className="px-4 py-3">
                  {order.createdAt.split("T")[0]}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/seller/orders/messages/${order.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Send
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
