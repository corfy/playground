"use client";
import Image from "next/image";
import "./style.scss";
import { useEffect, useState } from "react";
import { Fab } from "@mui/material";
import { FaCoffee, FaNodeJs } from "react-icons/fa";
import TestExport from "@/components/testExport";

export default function Page() {
  const [direction, setDirection] = useState("");
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    setIsFirst(false);
    setDirection('');
  }, []);
  return (
    <>
      <div id="reset-this-root">
        <div className={`mywrapper ${isFirst ? "nopre" : ""}`}>
          <div
            id="stylecontainer"
            className={`${
              direction === "left"
                ? "left"
                : direction === "right"
                ? "right"
                : "stylecontainer"
            }`}
          >
            <div
              id="left"
              onClick={() => {
                setDirection("left");
              }}
            >
              <span>Do</span>

              <div className="content">
                <h1 data-shadow-text="About me">About me</h1>
                <p>mo mo mo momomo</p>
                <br />
                <div>nenenenen ne</div>
              </div>

              <ul onClick={(e) => e.stopPropagation()}>
                <li className="first">
                  <a href="#">CV</a>
                </li>
                <li className="second">
                  <a href="#">Work</a>
                </li>
                <li className="third">
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>

            <div
              id="right"
              onClick={() => {
                setDirection("right");
              }}
            >
              <span>Mo</span>
      
              <div className="content">
                <h1 data-shadow-text="Skillset">Skillset </h1>
                <p>Lorem ipsum dolor sit amet</p>
                <br />
                <TestExport/>
      
                <br />
                <div>nenenenen ne</div>
                <br />
                <div>nenenenen ne</div>
                <br />
                <div>nenenenen ne</div>
              </div>

              <ul onClick={(e) => e.stopPropagation()}>
                <li className="first">
                  <a href="#">Experience</a>
                </li>
                <li className="second">
                  <a href="#">Photo's</a>
                </li>
                <li className="third">
                  <a href="#">Blog</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Fab
        sx={{ position: "absolute", bottom: "2%", right: "2%"}}
        className="text-white"
        aria-label="add"
        variant="extended"
        onClick={() => setDirection('')}
      >
       <FaCoffee/> 
      </Fab>
    </>
  );
}
