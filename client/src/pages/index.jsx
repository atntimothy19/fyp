import AuthWrapper from "../components/AuthWrapper";
import HeroBanner from "../components/Landing/HeroBanner";
import Services from "../components/Landing/Services";
import { useStateProvider } from "../context/StateContext";
import React from "react";

function Index() {
  const [{ showLoginModal, showSignupModal }] = useStateProvider();

  return (
    <div className="px-4 md:px-8 py-6 md:py-10">
      {(showLoginModal || showSignupModal) ? (
        <AuthWrapper type={showLoginModal ? "login" : "signup"} />
      ) : (
        <>
          <HeroBanner />
          <Services />
        </>
      )}
    </div>
  );
}

export default Index;
