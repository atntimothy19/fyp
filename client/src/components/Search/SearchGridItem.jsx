import { HOST, IMAGES_URL } from "../../utils/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { FaStar } from "react-icons/fa";

function SearchGridItem({ gig }) {
  const router = useRouter();

  const calculateRatings = useMemo(() => {
    const { reviews } = gig;
    let rating = 0;
    if (!reviews?.length) {
      return 0;
    }
    reviews.forEach((review) => {
      rating += review.rating;
    });
    return (rating / reviews.length).toFixed(1);
  }, [gig.reviews]);

  return (
    <div
      className="w-full sm:max-w-[300px] flex flex-col gap-2 p-2 cursor-pointer mb-4"
      onClick={() => router.push(`/gig/${gig.id}`)}
    >
      <div className="relative w-full h-40 sm:h-32">
        {gig.images?.[0] ? (
          <Image
            src={`${IMAGES_URL}/${gig.images[0]}`}
            alt={`${gig.title} image`}
            layout="fill"
            className="rounded-xl object-cover"
          />
        ) : (
          <div className="w-full h-40 sm:h-32 bg-gray-200 rounded-xl flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div>
          {gig.createdBy?.profileImage ? (
            <Image
              src={`${HOST}/${gig.createdBy.profileImage}`}
              alt={`${gig.createdBy.username} profile`}
              height={30}
              width={30}
              className="rounded-full"
            />
          ) : (
            <div className="bg-purple-500 h-7 w-7 flex items-center justify-center rounded-full">
              <span className="text-lg text-white">
                {gig.createdBy?.email?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <span className="text-sm">
          <strong className="font-medium">{gig.createdBy?.username}</strong>
        </span>
      </div>
      <div>
        <p className="line-clamp-2 text-[#404145] text-sm">{gig.title}</p>
      </div>
      <div className="flex items-center gap-1 text-yellow-400 text-sm">
        <FaStar />
        <span>
          <strong className="font-medium">{calculateRatings}</strong>
        </span>
        <span className="text-[#74767e]">({gig.reviews?.length || 0})</span>
      </div>
      <div>
        <strong className="font-medium text-sm">From ${gig.price}</strong>
      </div>
    </div>
  );
}

export default SearchGridItem;
