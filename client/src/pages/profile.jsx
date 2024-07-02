import React, { useEffect, useState } from "react";
import {
  HOST,
  SET_USER_IMAGE,
  SET_USER_INFO,
} from "../utils/constants";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";

function Profile() {
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvider();
  const [isLoaded, setIsLoaded] = useState(false);
  const [image, setImage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    userName: "",
    fullName: "",
    description: "",
  });

  useEffect(() => {
    const handleData = { ...data };
    if (userInfo) {
      if (userInfo?.username) handleData.userName = userInfo?.username;
      if (userInfo?.description) handleData.description = userInfo?.description;
      if (userInfo?.fullName) handleData.fullName = userInfo?.fullName;

      setData(handleData);
      setIsLoaded(true);
    }
  }, [userInfo]);

  const handleFile = (e) => {
    let file = e.target.files;
    const fileType = file[0]["type"];
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (validImageTypes.includes(fileType)) {
      setImage(file[0]);
    } else {
      setErrorMessage("Invalid file type. Please select an image file.");
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const setProfile = async () => {
    try {
      const response = await axios.post(
        SET_USER_INFO,
        { ...data },
        { withCredentials: true }
      );
      if (response.data.userNameError) {
        setErrorMessage("Enter a Unique Username");
      } else {
        let imageName = "";
        if (image) {
          const formData = new FormData();
          formData.append("images", image);
          const uploadResponse = await axios.post(SET_USER_IMAGE, formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (uploadResponse.data.img) {
            imageName = uploadResponse.data.img;
          } else {
            setErrorMessage("Failed to upload the image.");
          }
        }

        dispatch({
          type: reducerCases.SET_USER,
          userInfo: {
            ...userInfo,
            ...data,
            image: imageName.length ? HOST + "/" + imageName : false,
          },
        });

        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred while setting the profile.");
    }
  };

  const inputClassName =
    "block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500";
  const labelClassName =
    "mb-2 text-lg font-medium text-gray-900  dark:text-white";
  return (
    <>
      {isLoaded && (
        <div className="flex flex-col items-center justify-start min-h-[80vh] gap-3 px-4">
          {errorMessage && (
            <div>
              <span className="text-red-600 font-bold">{errorMessage}</span>
            </div>
          )}
          <h2 className="text-3xl">Welcome to Freelancer Marketplace </h2>
          <h4 className="text-xl">
           
          </h4>
          <div className="flex flex-col items-center w-full gap-5">
            <div
              className="flex flex-col items-center cursor-pointer"
            >
              <label className={labelClassName} htmlFor="profileImage">
                Select a Profile Picture
              </label>
              <div className="bg-purple-500 h-36 w-36 flex items-center justify-center rounded-full relative">
                {image ? (
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="profile"
                    fill
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-6xl text-white">
                    {userInfo.email[0].toUpperCase()}
                  </span>
                )}
                <div className="absolute bg-slate-400 h-full w-full rounded-full flex items-center justify-center opacity-0 hover:opacity-100">
                  <label htmlFor="profileImage" className="text-white text-lg cursor-pointer">
                    Choose Image
                  </label>
                  <input
                    type="file"
                    onChange={handleFile}
                    className="absolute opacity-0 cursor-pointer w-full h-full"
                    id="profileImage"
                    name="profileImage"
                    title="Select a profile picture"
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              <label className={labelClassName} htmlFor="userName">
                Please select a username
              </label>
              <input
                className={inputClassName}
                type="text"
                name="userName"
                id="userName"
                placeholder="Username"
                value={data.userName}
                onChange={handleChange}
                title="Enter your username"
              />
            </div>

            <div className="w-full">
              <label className={labelClassName} htmlFor="fullName">
                Please enter your full Name
              </label>
              <input
                className={inputClassName}
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Full Name"
                value={data.fullName}
                onChange={handleChange}
                title="Enter your full name"
              />
            </div>

            <div className="w-full">
              <label className={labelClassName} htmlFor="description">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={data.description}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Description"
                title="Enter a brief description about yourself"
              ></textarea>
            </div>
            <button
              className="border text-lg font-semibold px-5 py-3 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md"
              type="button"
              onClick={setProfile}
              title="Confirm your profile information"
            >
              Update Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
