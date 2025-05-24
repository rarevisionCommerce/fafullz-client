import React from "react";
import { Link } from "react-router-dom";

import {  MdArrowBack } from "react-icons/md";


function RegisterSeller() {
  

  return (
    <div className="bg-loginBg flex flex-col justify-center items-center min-h-[100vh] bg-cover bg-center bg-no-repeat bg-blend-overlay  bg-[#404740]   ">
      <h1 className="text-lg font-bold text-gray-800 p-3">Rare Vision</h1>
      {/* Login form  */}
      <div className="min-h-[300px] w-[93%] md:w-[400px]  bg-light bg-opacity-80 text-start rounded-md">
        <form
          className="px-2 md:px-4 py-2 text-darktext "
        >
          <h1 className=" text-2xl  font-semibold my-4 ">Sign Up (Seller)</h1>

          <div className="bg-primary text-white py-2 px-4 flex flex-col gap-4 rounded-md items-center">
            <p className="text-sm font-medium">
              Ready to start selling your products on Fafullz?
            </p>
            <p
              className="text-sm font-bold text-center ml-4 py-2 px-3 rounded-lg bg-white text-blue-500"
            >
              Contact us today on!
              <br />
              JabberId: rarevision@yax.im
            </p>
          </div>

          <div className="my-10 flex justify-between ">
            <div className=" ">
              <Link
                to="/"
                className="flex items-center gap-1 bg-slate-700 text-light py-2 px-4"
              >
                <span className="">
                  <MdArrowBack />
                </span>
                <h1>Back</h1>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterSeller;

