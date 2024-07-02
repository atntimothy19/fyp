import SearchGridItem from "../components/Search/SearchGridItem";
import { SEARCH_GIGS_ROUTE } from "../utils/constants";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Search() {
  const router = useRouter();
  const { category, q } = router.query;
  const [gigs, setGigs] = useState(undefined);

  useEffect(() => {
    const getData = async () => {
      try {
        const {
          data: { gigs },
        } = await axios.get(
          `${SEARCH_GIGS_ROUTE}?searchTerm=${q}&category=${category}`
        );
        setGigs(gigs);
      } catch (err) {
        console.error(err);
      }
    };

    if (category || q) getData();
  }, [category, q]);

  return (
    <>
      {gigs && (
        <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-10 xl:mx-12 mb-8">
          {q && (
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
              Results for <strong>{q}</strong>
            </h3>
          )}

          <div className="my-2">
            <span className="text-gray-600 text-sm">
              {gigs.length} services available
            </span>
          </div>
          <div className="grid gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {gigs.map((gig) => (
              <SearchGridItem gig={gig} key={gig.id} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Search;
