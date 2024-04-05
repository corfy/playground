"use client";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { menuData } from "@/data/menu";
import ThemeSwitch from "@/components/theme-switch";

const Navbar = () => {
    const [nav, setNav] = useState(false);


  return (
    <div className="flex justify-between items-center w-full h-10 z-10 px-4 text-seafoam-blue drop-shadow dark:text-white bg-seafoam-green dark:bg-seafoam-blue transition-colors duration-100 ease-in-out fixed nav">
      <div>
        <h1 className="text-5xl font-signature ml-2">
        <Link  className="link-underline link-underline-black"  rel="noreferrer" href={''}>Cv</Link>
         
        </h1>
      </div>

      <ul className="hidden md:flex">
        {menuData.map(({ id, link }) => (
          <li
            key={id}
            className="nav-links px-4 py-3 cursor-pointer capitalize font-medium text-seafoam-blue dark:text-seafoam-green hover:scale-105 hover:text-white dark:hover:text-gray-700 duration-200 link-underline"
          >
            <Link href={link}>{link}</Link>
          </li>
        ))}
        <li>
        <ThemeSwitch/>
        </li>
      </ul>

      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
      >
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500">
          {menuData.map(({ id, link }) => (
            <li
              key={id}
              className="px-4 cursor-pointer capitalize py-6 text-4xl"
            >
              <Link onClick={() => setNav(!nav)} href={link}>
                {link}
              </Link>
            </li>
          ))}
          <li 
            key="6" 
            className="px-4 cursor-pointer capitalize py-6 text-4xl"
        >
         
          </li>
        </ul>
      )}
     
    </div>
  );
};

export default Navbar;