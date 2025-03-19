import React, { useState, useEffect } from "react";
import { FaBars, FaCommentsDollar } from "react-icons/fa";

import { Link, NavLink, Outlet } from "react-router-dom";
import {
  AiOutlineClose,
  AiOutlineCaretDown,
  AiFillMoneyCollect,
} from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { RiRefund2Line } from "react-icons/ri";
import { MdSell, MdPriceChange, MdOutlineDashboard } from "react-icons/md";
import logo from "../assets/graphics/fafullz-logo.jpg";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PulseLoader from "react-spinners/PulseLoader";
import AdminProfile from "../components/AdminProfile";
import {  Indicator } from "@mantine/core";

function AdminDashboard() {
  const axios = useAxiosPrivate();

  const { auth } = useAuth();
  const userName = auth?.userName || "Admin";

  const [isOpen, setIsOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [dropdown, setDropdown] = useState(false);

  const menuItem = [
    {
      path: "admindash",
      name: "Dashboard ",
      icon: <MdOutlineDashboard size={20} />,
    },
    {
      path: "sellers",
      name: "Sellers ",
      icon: <MdSell size={20} />,
    },
    {
      path: "buyers",
      name: "Buyers ",
      icon: <MdSell size={20} />,
    },
    {
      path: "requests",
      name: "Withdraw Requests ",
      icon: <AiFillMoneyCollect size={20} />,
    },
    {
      path: "set-prices",
      name: "Set Prices",
      icon: <MdPriceChange size={20} />,
    },
    {
      path: "refund",
      name: "Refund ",
      icon: <RiRefund2Line size={20} />,
    },
    {
      path: "supports",
      name: "Support ",
      icon: <BiSupport size={20} />,
    },
  ];

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const sizeOfTheWindow = windowSize.innerWidth;

  if (sizeOfTheWindow < 900 && isOpen) {
    setIsOpen(false);
  }

  // get all refunds
  const fetchRefunds = () => {
    return axios.get(`/refunds/count`);
  };

  const {
    isLoading: loadingRefunds,
    data: refundData,
    refetch,
    isRefetching: refetchingRefunds,
  } = useQuery([`refundscount-`], fetchRefunds, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    staleTime: 5000, // data can remain stale for 5 seconds
    refetchInterval: 5000 // refetch every 5 seconds
  });

  // get all refunds
  const fetchSupportCount = () => {
    return axios.get(`/support/admin-unread`);
  };

  const { isLoading: loadingSupports, data: supportData } = useQuery(
    [`supportcount-`],
    fetchSupportCount,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
      staleTime: 5000, // data can remain stale for 5 seconds
      refetchInterval: 5000 // refetch every 5 seconds
    }
  );
  
  // get all refunds
  const fetchWithdrawRequestsCount = () => {
    return axios.get(`/withdrawals/unread`);
  };

  const { isLoading: loadingRequess, data: withdrawData } = useQuery(
    [`withdrawcount-`],
    fetchWithdrawRequestsCount,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
      staleTime: 5000, // data can remain stale for 5 seconds
      refetchInterval: 5000 // refetch every 5 seconds
    }
  );

  return (
    <div className="">
      {/* navbar */}
      <div className=" bg-secondary text-light p-2 md:p-5 flex flex-col md:flex-row justify-between fixed top-0 left-0 right-0 z-10 ">
        <div className="flex justify-between py-2 px-2 items-center">
          <div className="flex gap-4 items-center">
            <img src={logo} alt="" className=" w-[30px] h-[30px] " />
            {/* <h1 className="text-2xl">⭐ FAFullz</h1> */}
          </div>
          <div className="md:hidden">
            {mobileMenu ? (
              <div onClick={(e) => setMobileMenu(!mobileMenu)}>
                <AiOutlineClose size={22} />
              </div>
            ) : (
              <div onClick={(e) => setMobileMenu(!mobileMenu)}>
                <FaBars size={22} />
              </div>
            )}
          </div>
        </div>
        <hr className="w-full border-1 mb-4  border-primary md:hidden" />
        <div className="flex gap-2 pr-5 justify-end">
          <div className="pr-4 pt-[2px] " title="Withdraw Requests">
            <Link to={"/admin-dash/requests"}>
              {withdrawData?.data > 0 ? (
                <Indicator
                  inline
                  label={withdrawData?.data}
                  size={16}
                >
                  <AiFillMoneyCollect size={23} />
                </Indicator>
              ) : (
                <AiFillMoneyCollect size={23} />
              )}
            </Link>
          </div>
          <div className="pr-4 pt-[1px] " title="Support">
            <Link to={"/admin-dash/supports"}>
              {supportData?.data?.totalAdminUnread > 0 ? (
                <Indicator
                  inline
                  label={supportData?.data?.totalAdminUnread}
                  size={16}
                >
                  <BiSupport size={23} />
                </Indicator>
              ) : (
                <BiSupport size={23} />
              )}
            </Link>
          </div>
          <div title="Refund">
            <Link to={"/admin-dash/refund"}>
              {
                refundData?.data > 0 ? 
              <Indicator inline label={refundData?.data} size={16}>
                <FaCommentsDollar size={25} />
              </Indicator> : <FaCommentsDollar size={25} />
              }
            </Link>
          </div>

          <div
            className=" pl-5 flex gap-4 hover:cursor-pointer"
            onClick={() => {
              setDropdown(!dropdown);
            }}
          >
            <p className=" sm:flex">{userName}</p>
            <h1 className="mt-1">
              <AiOutlineCaretDown size={23} />
            </h1>
            {dropdown && <AdminProfile />}
          </div>
        </div>
      </div>

      {/* main content*/}
      <div className="flex pt-[100px] md:pt-[85px] overflow- min-h-[100vh]">
        <div
          style={{ width: isOpen ? "270px" : "80px" }}
          className="hidden md:flex flex-col bg-tertiary text-white h-screen w-[260px]  overflow-y-auto  ease-in-0ut duration-500 "
        >
          <div className="flex items-center align-middle py-[20px] pl-[15px] ">
            <div
              style={{ marginLeft: isOpen ? "50px" : "0px" }}
              className="flex text-[25px]  ml-[50px] "
            >
              {isOpen ? (
                <AiOutlineClose onClick={toggle} />
              ) : (
                <FaBars onClick={toggle} />
              )}
            </div>
          </div>
          {menuItem?.map((item, index) => {
            return (
              <NavLink
                to={item.path}
                key={index}
                className="flex  py-[10px] px-[15px] gap-[15px]  border-b border-b-black bottom-2 ease-in-out duration-500   hover:ease-in-out hover:duration-500 "
              >
                <div className="text-[23px]  text-primary  ">{item.icon}</div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="text-sm"
                >
                  {item.name}
                </div>
              </NavLink>
            );
          })}
        </div>
        {/* mobile sidebar */}
        <div
          className={
            mobileMenu
              ? "absolute top-[108px] ease-in-out duration-500 h-screen text-light flex flex-col bg-secondary w-[100%] py-6 md:hidden z-10"
              : " absolute left-[-100%] "
          }
        >
          {menuItem?.map((item, index) => {
            return (
              <NavLink
                onClick={() => setMobileMenu(!mobileMenu)}
                to={item.path}
                key={index}
                className="flex  py-[10px] px-[15px] gap-[15px]  border-b border-b-black bottom-2 ease-in-out duration-500  hover:bg-[#1a1a1a] hover:ease-in-out hover:duration-500 "
              >
                <div className="text-[px]  text-primary  ">{item.icon}</div>
                <div className="text-sm text-light hover:text-light">
                  {item.name}
                </div>
              </NavLink>
            );
          })}
        </div>
        <main
          className="w-full py-6 px-3 md:px-6 overflow-y-scroll h-[100vh] pb- bg-gray-100"
          onClick={() => {
            setDropdown(false);
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
