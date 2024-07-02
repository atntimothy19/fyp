import { useStateProvider } from "../../../context/StateContext";
import { GET_BUYER_ORDERS_ROUTE } from "../../../utils/constants";
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
        } = await axios.get(GET_BUYER_ORDERS_ROUTE, { withCredentials: true });
        setOrders(orders);
      } catch (err) {
        console.error(err);
      }
    };
    if (userInfo) getOrders();
  }, [userInfo]);

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-4 sm:px-6 lg:px-8">
      <h3 className="m-5 text-2xl font-semibold text-center sm:text-left">All your Orders</h3>
      <div className="shadow-md sm:rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-3 py-2">Order Id</th>
              <th scope="col" className="px-3 py-2">Name</th>
              <th scope="col" className="px-3 py-2">Category</th>
              <th scope="col" className="px-3 py-2">Price</th>
              <th scope="col" className="px-3 py-2">Delivery Time</th>
              <th scope="col" className="px-3 py-2">Order Date</th>
              <th scope="col" className="px-3 py-2">Send Message</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700" key={order.id}>
                <th scope="row" className="px-3 py-2">{order.id}</th>
                <td className="px-3 py-2 font-medium">{order.gig.title}</td>
                <td className="px-3 py-2">{order.gig.category}</td>
                <td className="px-3 py-2">{order.price}</td>
                <td className="px-3 py-2">{order.gig.deliveryTime}</td>
                <td className="px-3 py-2">{order.createdAt.split("T")[0]}</td>
                <td className="px-3 py-2">
                  <Link href={`/buyer/orders/messages/${order.id}`} className="text-blue-600 hover:underline">
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
