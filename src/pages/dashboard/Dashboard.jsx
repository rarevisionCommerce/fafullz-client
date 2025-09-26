import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaUserAlt,
  FaCartArrowDown,
  FaQuestionCircle,
  FaSearch,
} from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { Link, NavLink, Outlet } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";
import {
  AiOutlineClose,
  AiFillCreditCard,
  AiOutlineCaretDown,
} from "react-icons/ai";
import { FaRobot } from "react-icons/fa";
import { BiBitcoin, BiNews, BiSupport } from "react-icons/bi";
import { TbPhoneCall, TbMessageCircle } from "react-icons/tb";
import { RiCellphoneFill } from "react-icons/ri";
import { VscFileSymlinkDirectory } from "react-icons/vsc";
import { FaRegIdCard } from "react-icons/fa";
import ProfileDropDown from "../../components/ProfileDropDown";
import logo from "../../assets/graphics/fafullz-logo.jpg";
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
    {
      path: "my-orders",
      name: "My Orders",
      icon: <FaCartArrowDown size={20} />,
    },
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

  // Improved CTA Button Components with better styling and positioning
  const CTAButton = ({ 
    onClick, 
    icon: Icon, 
    label, 
    variant = 'primary',
    size = 'default',
    className = '',
    ...props 
  }) => {
    const baseClasses = "font-semibold rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
      primary: "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white focus:ring-blue-500",
      secondary: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white focus:ring-orange-500",
      telegram: "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white focus:ring-blue-400"
    };
    
    const sizes = {
      small: "py-2 px-3 text-xs",
      default: "py-2.5 px-4 text-sm",
      large: "py-3 px-6 text-base",
      icon: "p-2.5"
    };
    
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        <Icon size={size === 'icon' ? 20 : 16} />
        {size !== 'icon' && <span>{label}</span>}
      </button>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Enhanced Navbar */}
      <nav className="bg-secondary text-white shadow-2xl fixed top-0 left-0 right-0 z-50 border-b border-gray-700">
        {/* Main navbar content */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and brand */}
            <div className="flex items-center gap-3">
              <img src={logo} alt="FAFullz Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg" />
              <h1 className="hidden sm:block text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FAFullz
              </h1>
            </div>

            {/* Desktop CTA Buttons - Better positioned and styled */}
            <div className="hidden lg:flex items-center gap-3">
              <CTAButton
                onClick={() => window.open('https://rarevision.net', '_blank')}
                icon={FaSearch}
                label="SSN Lookup"
                variant="secondary"
                title="SSN Lookup Service"
              />
              <CTAButton
                onClick={() => window.open("https://t.me/FafullzBot", "_blank")}
                icon={FaRobot}
                label="Telegram Bot"
                variant="primary"
                title="Access our Telegram Bot"
              />
              <CTAButton
                onClick={() => window.open("https://t.me/fafullzz", "_blank")}
                icon={FaTelegramPlane}
                label="Join Community"
                variant="telegram"
                title="Join our Telegram community"
              />
            </div>

            {/* User info and cart - Better organized */}
            <div className="flex items-center gap-4">
              {/* Support notification */}
              <Link 
                to="/dash/support" 
                className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                title="Support Messages"
              >
                {conversationData?.data?.totalCustomerUnread > 0 ? (
                  <Indicator
                    inline
                    label={conversationData?.data?.totalCustomerUnread}
                    size={16}
                    color="red"
                  >
                    <TbMessageCircle size={24} />
                  </Indicator>
                ) : (
                  <TbMessageCircle size={24} />
                )}
              </Link>

              {/* Shopping cart */}
              <Link 
                to="cart" 
                className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                title="Shopping Cart"
              >
                <Indicator
                  inline
                  size={16}
                  offset={4}
                  position="top-end"
                  color="blue"
                  label={totalItems || 0}
                >
                  <CgShoppingCart size={26} />
                </Indicator>
              </Link>

              {/* User profile dropdown */}
              <div
                className="relative flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-200"
                onClick={() => setDropdown(!dropdown)}
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                  ${formatCurrency(paymentsData?.data?.balance || 0)}
                </div>
                <span className="hidden sm:block text-sm font-medium">{userName}</span>
                <AiOutlineCaretDown size={16} className={`transform transition-transform duration-200 ${dropdown ? 'rotate-180' : ''}`} />
                {dropdown && <ProfileDropDown />}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {mobileMenu ? (
                  <AiOutlineClose size={24} />
                ) : (
                  <FaBars size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile CTA buttons bar - Better positioned below main nav */}
        <div className="lg:hidden bg-gray-800 px-4 py-3 border-t border-gray-700">
          <div className="flex gap-2 justify-center">
            <CTAButton
              onClick={() => window.open('https://rarevision.net', '_blank')}
              icon={FaSearch}
              label="SSN Lookup"
              variant="secondary"
              size="small"
              className="flex-1 max-w-32"
            />
            <CTAButton
              onClick={() => window.open("https://t.me/FafullzBot", "_blank")}
              icon={FaRobot}
              label="Bot"
              variant="primary"
              size="small"
              className="flex-1 max-w-24"
            />
            <CTAButton
              onClick={() => window.open("https://t.me/fafullzz", "_blank")}
              icon={FaTelegramPlane}
              label="Community"
              variant="telegram"
              size="small"
              className="flex-1 max-w-32"
            />
          </div>
        </div>
      </nav>

      {/* Main content layout */}
      <div className="flex pt-16 lg:pt-16">
        {/* Desktop Sidebar - Enhanced design */}
        <aside
          style={{ width: isOpen ? "280px" : "80px" }}
          className="hidden lg:flex flex-col bg-tertiary text-white h-screen fixed left-0 top-16 shadow-2xl border-r border-gray-700 transition-all duration-300 ease-in-out z-40"
        >
          {/* Sidebar toggle */}
          <div className="flex items-center justify-center py-6 border-b border-gray-700">
            <button
              onClick={toggle}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              {isOpen ? <AiOutlineClose size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Sidebar CTA buttons */}
          <div className="p-4 space-y-3 border-b border-gray-700">
            <CTAButton
              onClick={() => window.open('https://rarevision.net', '_blank')}
              icon={FaSearch}
              label={isOpen ? "SSN Lookup" : undefined}
              variant="secondary"
              size={isOpen ? "default" : "icon"}
              className="w-full"
              title="SSN Lookup Service"
            />
            <CTAButton
              onClick={() => window.open("https://t.me/FafullzBot", "_blank")}
              icon={FaRobot}
              label={isOpen ? "Telegram Bot" : undefined}
              variant="primary"
              size={isOpen ? "default" : "icon"}
              className="w-full"
              title="Access our Telegram Bot"
            />
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 py-4">
            {menuItem.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-4 mx-2 rounded-lg transition-all duration-200 hover:bg-gray-700 ${
                    isActive ? 'bg-blue-600 shadow-lg' : ''
                  }`
                }
              >
                <div className="text-blue-400 flex-shrink-0">{item.icon}</div>
                {isOpen && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile sidebar overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
            mobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenu(false)}
        />

        {/* Mobile sidebar */}
        <aside
          className={`fixed top-16 left-0 h-full w-80 bg-secondary text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
            mobileMenu ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-center">Quick Actions</h2>
            <div className="space-y-3">
              <CTAButton
                onClick={() => {
                  window.open('https://rarevision.net', '_blank');
                  setMobileMenu(false);
                }}
                icon={FaSearch}
                label="SSN Lookup Service"
                variant="secondary"
                className="w-full"
              />
              <CTAButton
                onClick={() => {
                  window.open("https://t.me/FafullzBot", "_blank");
                  setMobileMenu(false);
                }}
                icon={FaRobot}
                label="Telegram Bot"
                variant="primary"
                className="w-full"
              />
            </div>
          </div>

          <nav className="p-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            {menuItem.map((item, index) => (
              <NavLink
                onClick={() => setMobileMenu(false)}
                to={item.path}
                key={index}
                className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-4 rounded-lg transition-all duration-200 hover:bg-gray-700 ${
                    isActive ? 'bg-blue-600 shadow-lg' : ''
                  }`
                }
              >
                <div className="text-blue-400 flex-shrink-0">{item.icon}</div>
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content area */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isOpen ? 'lg:ml-[280px]' : 'lg:ml-[80px]'
          }`}
          onClick={() => setDropdown(false)}
        >
          <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;