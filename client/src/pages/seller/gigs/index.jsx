import { GET_USER_GIGS_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Index() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const getUserGigs = async () => {
      try {
        const {
          data: { gigs: gigsData },
        } = await axios.get(GET_USER_GIGS_ROUTE, {
          withCredentials: true,
        });
        setGigs(gigsData);
      } catch (err) {
        console.log(err);
      }
    };
    getUserGigs();
  }, []);

  const handleDelete = async (id) => {
    console.log('Delete button clicked for gig id:', id); 
    try {
      const response = await axios.delete(`${GET_USER_GIGS_ROUTE}/${id}`, {
        withCredentials: true,
      });
      console.log('Delete response:', response);
      setGigs(gigs.filter(gig => gig.id !== id));
    } catch (err) {
      console.log('Delete error:', err.response || err.message || err);
    }
  };  

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-4 md:px-32">
      <h3 className="m-5 text-2xl font-semibold">All your Gigs</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-2 md:px-6 py-3">Name</th>
              <th scope="col" className="px-2 md:px-6 py-3">Category</th>
              <th scope="col" className="px-2 md:px-6 py-3">Price (RM)</th>
              <th scope="col" className="px-2 md:px-6 py-3">Delivery Time (Days)</th>
              <th scope="col" className="px-2 md:px-6 py-3"><span className="sr-only">Edit</span></th>
              <th scope="col" className="px-2 md:px-6 py-3"><span className="sr-only">Delete</span></th>
            </tr>
          </thead>
          <tbody>
            {gigs.map(({ title, category, price, deliveryTime, id }) => (
              <tr
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={id}
              >
                <th
                  scope="row"
                  className="px-2 md:px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {title}
                </th>
                <td className="px-2 md:px-6 py-4">{category}</td>
                <td className="px-2 md:px-6 py-4">{price}</td>
                <td className="px-2 md:px-6 py-4">{deliveryTime}</td>
                <td className="px-2 md:px-6 py-4 text-right">
                  <Link
                    href={`/seller/gigs/${id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
                <td className="px-2 md:px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(id)}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Index;
