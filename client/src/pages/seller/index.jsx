import { useStateProvider } from "../../context/StateContext";
import { GET_SELLER_DASHBOARD_DATA } from "../../utils/constants";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Index() {
  const [{ userInfo }] = useStateProvider();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(undefined);

  useEffect(() => {
    const getBuyerDashboardData = async () => {
      try {
        const response = await axios.get(GET_SELLER_DASHBOARD_DATA, {
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log("Dashboard Data:", response.data.dashboardData); 
          setDashboardData(response.data.dashboardData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    if (userInfo) {
      getBuyerDashboardData();
    }
  }, [userInfo]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/gigs/${id}`, {
        withCredentials: true,
      });
      setGigs(gigs.filter(gig => gig.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {userInfo && (
        <div className="px-4 md:px-8 py-6 md:py-10">
          {/* Profile Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-28 w-28 md:h-36 md:w-36 rounded-full overflow-hidden">
              {userInfo?.imageName ? (
                <Image
                  src={userInfo.imageName}
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <div className="bg-purple-500 h-full w-full flex items-center justify-center rounded-full">
                  <span className="text-5xl text-white">
                    {userInfo.email[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="text-center">
              <span className="text-lg font-medium text-gray-700">
                {userInfo.username}
              </span>
              <span className="block text-sm font-semibold">{userInfo.fullName}</span>
            </div>
            <div className="text-center border-t pt-3">
              <p className="text-sm">{userInfo.description}</p>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <DashboardCard
              title="Total Gigs"
              value={dashboardData?.gigs}
              onClick={() => router.push("/seller/gigs")}
            />
            <DashboardCard
              title="Total Orders"
              value={dashboardData?.orders}
              onClick={() => router.push("/seller/orders")}
            />
            <DashboardCard
              title="Unread Messages"
              value={dashboardData?.unreadMessages}
              onClick={() => router.push("/seller/unread-messages")}
            />
            <DashboardCard 
              title="Earnings Today" 
              value={dashboardData?.dailyRevenue != null ? `$${dashboardData.dailyRevenue}` : "N/A"} 
            />
            <DashboardCard 
              title="Earnings Monthly" 
              value={`RM${dashboardData?.monthlyRevenue}`} 
            />
            <DashboardCard 
              title="Earnings Yearly" 
              value={`RM${dashboardData?.revenue}`} 
            />
          </div>
        </div>
      )}
    </>
  );
}

function DashboardCard({ title, value, onClick }) {
  return (
    <div
      className="p-6 bg-white dark:bg-gray-800 shadow-lg border-2 border-[#1DBF73] cursor-pointer hover:shadow-2xl transition-all duration-300 rounded-lg"
      onClick={onClick}
    >
      <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{title}</h2>
      <h3 className="text-[#1DBF73] text-4xl font-extrabold">{value}</h3>
    </div>
  );
}

export default Index;
