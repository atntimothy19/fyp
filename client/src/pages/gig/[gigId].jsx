import React, { useEffect, useState } from "react";
import Pricing from "../../components/Gigs/Pricing";
import Details from "../../components/Gigs/Details";
import { useRouter } from "next/router";
import axios from "axios";
import {
  CHECK_USER_ORDERED_GIG_ROUTE,
  GET_GIG_DATA,
} from "../../utils/constants";
import { useStateProvider } from "../../context/StateContext";
import { reducerCases } from "../../context/constants";

function Gig() {
  const router = useRouter();
  const { gigId } = router.query;
  const [{ gigData, userInfo }, dispatch] = useStateProvider();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch({ type: reducerCases.SET_GIG_DATA, gigData: undefined });
  }, [dispatch]);

  useEffect(() => {
    const fetchGigData = async () => {
      try {
        const {
          data: { gig },
        } = await axios.get(`${GET_GIG_DATA}/${gigId}`);
        dispatch({ type: reducerCases.SET_GIG_DATA, gigData: gig });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load gig data.");
        setLoading(false);
      }
    };
    if (gigId) fetchGigData();
  }, [gigId, dispatch]);

  useEffect(() => {
    const checkGigOrdered = async () => {
      try {
        const {
          data: { hasUserOrderedGig },
        } = await axios.get(`${CHECK_USER_ORDERED_GIG_ROUTE}/${gigId}`, {
          withCredentials: true,
        });
        dispatch({
          type: reducerCases.HAS_USER_ORDERED_GIG,
          hasOrdered: hasUserOrderedGig,
        });
      } catch (err) {
        console.error(err);
      }
    };
    if (userInfo && gigId) {
      checkGigOrdered();
    }
  }, [dispatch, gigId, userInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col mx-4 sm:mx-0">
      <Details gigData={gigData} />
      <Pricing gigData={gigData} userInfo={userInfo} />
    </div>
  );
}

export default Gig;
