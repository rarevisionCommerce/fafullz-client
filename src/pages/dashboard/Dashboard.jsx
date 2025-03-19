import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaUserAlt,
  FaCartArrowDown,
  FaQuestionCircle,
} from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { Link, NavLink, Outlet } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";
import {
  AiOutlineClose,
  AiFillCreditCard,
  AiOutlineCaretDown,
} from "react-icons/ai";
import { BiBitcoin, BiNews, BiSupport } from "react-icons/bi";
import { TbPhoneCall, TbMessageCircle } from "react-icons/tb";
import { RiCellphoneFill } from "react-icons/ri";
import { VscFileSymlinkDirectory } from "react-icons/vsc";
import { FaRegIdCard } from "react-icons/fa";
import ProfileDropDown from "../../components/ProfileDropDown";
import logo from "../../assets/graphics/logo3.png";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Indicator } from "@mantine/core";

function Dashboard() {
  const axiosPrivate = useAxiosPrivate();

  const { auth } = useAuth();
  const userName = auth?.userName || "username";
  const role =
    auth?.roles?.includes("Seller") || auth?.roles?.includes("Admin") || false;

  //  cart
  function useShoppingCart() {
    return useQuery(
      [`shoppingCart-${auth?.userId}`],
      async () => {
        const { data } = await axiosPrivate.get(`/cart/${auth?.userId}`);
        return data;
      },
      {
        keepPreviousData: true,
        refetchInterval: 5000, // 5 seconds in milliseconds
      }
    );
  }

  const { isLoading: loadingCart, error, data: cartData } = useShoppingCart();
  const totalItems = cartData?.cart?.length || 0;

  // end of cart
  //   fetching user payment history
  const fetchPayments = () => {
    return axiosPrivate.get(`/payments/payment-history/${auth?.userId}`);
  };

  const {
    isLoading: loadingPayments,
    data: paymentsData,
    refetch,
    isRefetching: refetchingPayments,
  } = useQuery(["payments"], fetchPayments, {
    enabled: !!auth?.userId,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  //end of fetching payments------------------

  const [isOpen, setIsOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [dropdown, setDropdown] = useState(false);

  const menuItem = [
    {
      path: "news",
      name: "News",
      icon: <BiNews size={23} />,
    },
    {
      path: "addfunds",
      name: "Add Funds",
      icon: <BiBitcoin size={23} />,
    },
    {
      path: "ssn",
      name: "SSN/DOB",
      icon: <AiFillCreditCard />,
    },
    // {
    //   path: "accounts",
    //   name: "Accounts",
    //   icon: <FaUserAlt />,
    // },
    // {
    //   path: "cards",
    //   name: "Cards",
    //   icon: <AiFillCreditCard size={20} />,
    // },
    // {
    //   path: "voice",
    //   name: "Google Voice",
    //   icon: <TbPhoneCall size={22} />,
    // },

    // {
    //   path: "text-now",
    //   name: "TextNow/Mail",
    //   icon: <RiCellphoneFill size={20} />,
    // },
    // {
    //   path: "files",
    //   name: "Files",
    //   icon: <VscFileSymlinkDirectory size={21} />,
    // },
    // {
    //   path: "dumps",
    //   name: "Dumps",
    //   icon: <FaRegIdCard size={21} />,
    // },
    {
      path: "my-orders",
      name: "My Orders",
      icon: <FaCartArrowDown size={20} />,
    },

    // {
    //   path: "faq",
    //   name: "FAQ",
    //   icon: <FaQuestionCircle size={20} />,
    // },
    {
      path: "support",
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

  // const productToSore = cartData?.cart || []

  // useEffect(() => {
  //   // Update local storage whenever the products are updated
  //   localStorage.setItem("products", JSON.stringify(productToSore));
  // }, [cartData?.cart]);

  function formatCurrency(number) {
    return Number.parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  //get conversation......................
  function getUnreadMessagesCount() {
    return axiosPrivate.get(`/support/customer-unread/${auth?.jabberId}`);
  }
  // querying funtion
  const {
    data: conversationData,
    isLoading: loadingConversation,
    isError: errorConversation,
  } = useQuery([`message-count-${auth?.jabberId}`], getUnreadMessagesCount, {
    staleTime: 5000, // data can remain stale for 5 seconds
    refetchInterval: 5000, // refetch every 5 seconds
  });
  // end...................

  return (
    <div className="">
      {/* navbar */}
      <div className=" bg-secondary text-light p-2 flex flex-col md:flex-row justify-between fixed top-0 left-0 right-0 z-10 ">
        <div className="flex justify-between py-2 px-2 items-center">
          <div className="flex gap-4 items-center">
            <img src={logo} alt="" className=" w-[] h-[50px] " />
            {/* <h1 className="text-2xl">FAFullz</h1> */}
          </div>
          <a
            className="md:hidden"
            href="https://t.me/RareVisionShop"
            target="_blank"
          >
            <button className="bg-blue-500 flex items-center hover:bg-blue-600 text-white font-bold py-1 px-4 rounded">
              <FaTelegramPlane className="inline-block mr-2" />
              <p className="hidden md:flex">Join Us on Telegram</p>
            </button>
          </a>
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
        <a className="hidden md:flex" href="https://t.me/" target="_blank">
          <p className="bg-blue-500 h-8  flex items-center hover:bg-blue-600 text-white font-bold py-[1px] px-4 rounded">
            <FaTelegramPlane className="inline-block mr-2" />
            <p className="hidden text-sm md:flex">Join Us on Telegram</p>
          </p>
        </a>
        <hr className="w-full border-1 mb-4  border-primary md:hidden" />
        <div className="flex gap-2 pr-5 justify-end">
          <div className="pr-5" title="Support">
            <Link to={"/dash/support"}>
              {conversationData?.data?.totalCustomerUnread > 0 ? (
                <Indicator
                  inline
                  label={conversationData?.data?.totalCustomerUnread}
                  size={16}
                >
                  <TbMessageCircle size={25} />
                </Indicator>
              ) : (
                <TbMessageCircle size={25} />
              )}
            </Link>
          </div>

          <h1>Cart</h1>

          <Link to={"cart"}>
            <div className="flex">
              <Indicator
                inline
                size={16}
                offset={4}
                position="top-end"
                color=""
                label={totalItems || 0}
              >
                <CgShoppingCart size={30} />
              </Indicator>
            </div>
          </Link>

          <div
            className=" pl-5 flex gap-4 hover:cursor-pointer"
            onClick={() => {
              setDropdown(!dropdown);
            }}
          >
            {loadingCart ? (
              <div>
                <h1 className="bg-primary px-2 h-7   rounded ">
                  {"$" + formatCurrency(cartData?.balanceObj?.balance || 0)}
                </h1>
              </div>
            ) : (
              <h1 className="bg-primary px-2 h-7   rounded ">
                {"$" + formatCurrency(paymentsData?.data?.balance || 0)}
              </h1>
            )}
            <p className="hidden sm:flex">{userName}</p>
            <h1 className="mt-1">
              <AiOutlineCaretDown size={23} />
            </h1>
            {dropdown && <ProfileDropDown />}
          </div>
        </div>
      </div>

      {/* main content*/}
      <div className="flex pt-[130px] md:pt-[60px] overflow- min-h-[100vh]">
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

          {/* {menuItem.map((item, index) => 
          


            
          )} */}
        </div>
        <main
          className="w-full py-6 px-3 md:px-6 overflow-y-scroll h-[100vh] pb-[200px] bg-[#2d2d2d]  "
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

export default Dashboard;
