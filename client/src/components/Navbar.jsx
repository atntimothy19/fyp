import React, { useEffect, useState } from "react";
import CustomLogo from "./FreelancerLogo";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useCookies } from "react-cookie";
import axios from "axios";
import { GET_USER_INFO, HOST } from "../utils/constants";
import ContextMenu from "./ContextMenu";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";

function Navbar() {
  const [cookies] = useCookies();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [{ showLoginModal, showSignupModal, isSeller, userInfo }, dispatch] =
    useStateProvider();
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleLogin = () => {
    if (showSignupModal) {
      dispatch({
        type: reducerCases.TOGGLE_SIGNUP_MODAL,
        showSignupModal: false,
      });
    }
    dispatch({
      type: reducerCases.TOGGLE_LOGIN_MODAL,
      showLoginModal: true,
    });
  };

  const handleSignup = () => {
    if (showLoginModal) {
      dispatch({
        type: reducerCases.TOGGLE_LOGIN_MODAL,
        showLoginModal: false,
      });
    }
    dispatch({
      type: reducerCases.TOGGLE_SIGNUP_MODAL,
      showSignupModal: true,
    });
  };

  const links = [
    { linkName: "Log in", handler: handleLogin, type: "button" },
    { linkName: "Join", handler: handleSignup, type: "button2" },
  ];

  const handleOrdersNavigate = () => {
    if (isSeller) router.push("/seller/orders");
    else router.push("/buyer/orders");
  };

  const handleModeSwitch = () => {
    dispatch({ type: reducerCases.SWITCH_MODE });
    if (isSeller) {
      router.push("/buyer/orders");
    } else {
      router.push("/seller");
    }
  };

  useEffect(() => {
    if (cookies.jwt && !userInfo) {
      const getUserInfo = async () => {
        try {
          const {
            data: { user },
          } = await axios.post(
            GET_USER_INFO,
            {},
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${cookies.jwt}`,
              },
            }
          );

          let projectedUserInfo = { ...user };
          if (user.image) {
            projectedUserInfo = {
              ...projectedUserInfo,
              imageName: HOST + "/" + user.image,
            };
          }
          delete projectedUserInfo.image;
          dispatch({
            type: reducerCases.SET_USER,
            userInfo: projectedUserInfo,
          });
          setIsLoaded(true);
          if (user.isProfileSet === false) {
            router.push("/profile");
          }
        } catch (err) {
          console.log(err);
        }
      };

      getUserInfo();
    } else {
      setIsLoaded(true);
    }
  }, [cookies, userInfo, dispatch]);

  const handleContextMenu = () => {
    setIsContextMenuVisible(!isContextMenuVisible);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const ContextMenuData = [
    {
      name: "Profile",
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        router.push("/profile");
      },
    },
    {
      name: "Logout",
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        router.push("/logout");
      },
    },
  ];

  return (
    <>
      {isLoaded && (
        <nav className="w-full px-4 md:px-24 flex justify-between items-center py-4 bg-white top-0 z-30 fixed border-b border-gray-200">
          <div className="flex items-center">
            <Link href="/">
              <CustomLogo fillColor="#404145" />
            </Link>
          </div>
          <div className={`${isContextMenuVisible ? "block" : ""} md:flex items-center space-x-4 md:space-x-10`}>
            {!userInfo ? (
              <ul className="flex items-center space-x-2 md:space-x-4">
                {links.map(({ linkName, handler, type }) => {
                  return (
                    <li key={linkName} className="text-black font-medium">
                      {type === "link" && <Link href={handler}>{linkName}</Link>}
                      {type === "button" && <button onClick={handler}>{linkName}</button>}
                      {type === "button2" && (
                        <button
                          onClick={handler}
                          className="border text-md font-semibold py-1 px-2 md:px-3 rounded-sm border-[#1DBF73] text-[#1DBF73] hover:bg-[#1DBF73] hover:text-white hover:border-[#1DBF73] transition-all duration-500"
                        >
                          {linkName}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="flex flex-row items-center space-x-2 md:space-x-4">
                {isSeller ? (
                  <>
                    <li
                      className="cursor-pointer text-[#1DBF73] font-medium"
                      onClick={() => router.push("/seller")}
                    >
                      Dashboard
                    </li>
                    <div className="relative">
                      <li
                        className="cursor-pointer text-[#1DBF73] font-medium"
                        onClick={toggleDropdown}
                      >
                        Gigs
                      </li>
                      {isDropdownVisible && (
                        <ul className="absolute bg-white shadow-lg rounded-lg py-2 mt-2 space-y-2 z-50">
                          <li
                            className="cursor-pointer text-[#1DBF73] font-medium px-4"
                            onClick={() => {
                              toggleDropdown();
                              router.push("/seller/gigs/create");
                            }}
                          >
                            Create Gig
                          </li>
                          <li
                            className="cursor-pointer text-[#1DBF73] font-medium px-4"
                            onClick={() => {
                              toggleDropdown();
                              handleOrdersNavigate();
                            }}
                          >
                            Orders
                          </li>
                        </ul>
                      )}
                    </div>
                  </>
                ) : (
                  <li
                    className="cursor-pointer text-[#1DBF73] font-medium"
                    onClick={handleOrdersNavigate}
                  >
                    Orders
                  </li>
                )}
                <li
                  className="cursor-pointer font-medium"
                  onClick={handleModeSwitch}
                >
                  {isSeller ? "You Are Freelancer" : "You Are Customer"}
                </li>
                <li
                  className="relative cursor-pointer flex items-center"
                  onClick={handleContextMenu}
                >
                  <span className="flex items-center">
                    {userInfo?.imageName ? (
                      <Image
                        src={userInfo.imageName}
                        alt="Profile"
                        width={16}
                        height={16}
                        className="rounded-full ml-1"
                      />
                    ) : (
                      <div className="bg-purple-500 h-4 w-4 flex items-center justify-center rounded-full ml-1">
                        <span className="text-2xs text-white">
                          {userInfo &&
                            userInfo?.email &&
                            userInfo?.email[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="ml-1 text-2xs text-black">
                      {userInfo.username}
                    </span>
                  </span>
                  {isContextMenuVisible && <ContextMenu data={ContextMenuData} />}
                </li>
              </ul>
            )}
          </div>
        </nav>
      )}
    </>
  );
}

export default Navbar;
