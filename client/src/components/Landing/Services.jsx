import { categories } from "../../utils/categories";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function Services() {
  const router = useRouter();

  return (
    <div className="mx-4 sm:mx-20 my-8 sm:my-16">
      <h2 className="text-2xl sm:text-4xl mb-6 sm:mb-10 text-[#404145] font-bold text-center sm:text-left">
        All Service Categories
      </h2>
      <ul className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-10">
        {categories.map(({ name, logo }) => {
          return (
            <li
              key={name}
              className="flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl hover:border-[#1DBF73] border-2 border-transparent p-3 sm:p-5 transition-all duration-500"
              onClick={() => router.push(`/search?category=${name}`)}
            >
              <Image src={logo} alt="category" height={50} width={50} />
              <span className="text-sm sm:text-base mt-2">{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Services;
