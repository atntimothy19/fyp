import { useCookies } from "react-cookie";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../utils/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";

function AuthWrapper({ type }) {
  const [cookies, setCookies] = useCookies();
  const [{ showLoginModal, showSignupModal }, dispatch] = useStateProvider();
  const router = useRouter();

  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (cookies.jwt) {
      dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
      router.push("/dashboard");
    }
  }, [cookies, dispatch, router]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClick = async () => {
    const { email, password } = values;
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const {
        data: { user, jwt },
      } = await axios.post(
        type === "login" ? LOGIN_ROUTE : SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      setCookies("jwt", jwt);
      dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });

      if (user) {
        dispatch({ type: reducerCases.SET_USER, userInfo: user });
        window.location.reload();
      }
    } catch (err) {
      if (type === "login") {
        if (err.response?.status === 401) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError("Invalid email or password. Please try again.");
        }
      } else {
        if (err.response?.status === 409) {
          setError("Email is already registered. Please try logging in.");
        } else {
          setError("Email is already registered. Please try logging in.");
        }
      }
    }
  };

  useEffect(() => {
    const html = document.querySelector("html");
    const authModal = document.querySelector("#auth-modal");
    const blurDiv = document.querySelector("#blur-div");
    html.style.overflowY = "hidden";
    const handleBlurDivClick = () => {
      // dispatch(closeAuthModal());
    };
    const handleAuthModalClick = (e) => {
      // e.stopPropagation();
    };
    authModal?.addEventListener("click", handleAuthModalClick);
    blurDiv?.addEventListener("click", handleBlurDivClick);

    return () => {
      const html = document.querySelector("html");
      html.style.overflowY = "initial";
      blurDiv?.removeEventListener("click", handleBlurDivClick);
      authModal?.removeEventListener("click", handleAuthModalClick);
    };
  }, [dispatch, showLoginModal, showSignupModal]);

  return (
    <div className="fixed top-0 z-[100]">
      <div
        className="h-[100vh] w-[100vw] backdrop-blur-md fixed top-0"
        id="blur-div"
      ></div>
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
        <div
          className="fixed z-[101] max-w-[90%] sm:max-w-md bg-white flex flex-col justify-center items-center p-4 sm:p-8 rounded-lg shadow-lg"
          id="auth-modal"
        >
          <div className="flex flex-col justify-center items-center gap-4 sm:gap-7 w-full">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-700 text-center">
              {type === "login" ? "Log in" : "Register"}&nbsp;to Freelancer
            </h3>
            {error && (
              <div className="text-red-500 text-center">{error}</div>
            )}
            <div className="flex flex-col gap-3 sm:gap-5 w-full">
              <input
                type="text"
                name="email"
                placeholder="Email / Username"
                className="border border-slate-300 p-2 sm:p-3 w-full rounded-md"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-slate-300 p-2 sm:p-3 w-full rounded-md"
                name="password"
                onChange={handleChange}
              />
              <button
                className="bg-[#1DBF73] text-white p-2 sm:p-3 text-lg font-semibold rounded-md w-full"
                onClick={handleClick}
                type="button"
              >
                Continue
              </button>
            </div>
          </div>
          <div className="py-5 w-full flex items-center justify-center border-t border-slate-400">
            <span className="text-sm text-slate-700">
              {type === "login" ? (
                <>
                  Not a member yet?&nbsp;
                  <span
                    className="text-[#1DBF73] cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: reducerCases.TOGGLE_SIGNUP_MODAL,
                        showSignupModal: true,
                      });
                      dispatch({
                        type: reducerCases.TOGGLE_LOGIN_MODAL,
                        showLoginModal: false,
                      });
                    }}
                  >
                    Join Now
                  </span>
                </>
              ) : (
                <>
                  Already a member?&nbsp;
                  <span
                    className="text-[#1DBF73] cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: reducerCases.TOGGLE_SIGNUP_MODAL,
                        showSignupModal: false,
                      });
                      dispatch({
                        type: reducerCases.TOGGLE_LOGIN_MODAL,
                        showLoginModal: true,
                      });
                    }}
                  >
                    Login Now
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthWrapper;
