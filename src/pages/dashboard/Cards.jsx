import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import PulseLoader from "react-spinners/PulseLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Loader, Pagination } from "@mantine/core";
import filterOptions from "../filterOptions";
import countryList from "react-select-country-list";
import { useCreateCart } from "../../hooks/useCreateCart";
import useAuth from "../../hooks/useAuth";
import { CgShoppingCart } from "react-icons/cg";
import MultiRangeSlider from "multi-range-slider-react";


function Cards() {
    const axios = useAxiosPrivate();
  const countryOptions = useMemo(() => countryList().getData(), []);
  const [value2, setValue2] = useState("");

  const { auth } = useAuth();
  const createCart = useCreateCart();

  // filters
  const [perPage, setPerPage] = useState(30);
  const [activePage, setPage] = useState(1);
  const [bank, setBank] = useState("");
  const [type, setType] = useState("");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");
  const [bin, setBin] = useState("");
  const [state, setState] = useState("");
  const [classz, setClassz] = useState("");
  const [zip, setZip] = useState("");
  const [price, setPrice] = useState("");
  const [ssn, setSsn] = useState("");
  const [dob, setDob] = useState("");
  const [dl, setDl] = useState("");
  const [mmn, setMmn] = useState("");
  const [ip, setIp] = useState("");
  const [minValue, set_minValue] = useState(0);
  const [maxValue, set_maxValue] = useState(100);
  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };

  const fetchCards = () => {
    return axios.get(
      `/cards?page=${activePage}&perPage=${perPage}&bank=${bank}&type=${type}&level=${level}&bin=${bin}&state=${state}&country=${country}&classz=${classz}&zip=${zip}&price=${maxValue}&minPrice=${minValue}&ssn=${ssn}&dob=${dob}&dl=${dl}&mmn=${mmn}&ip=${ip}`
    );
  };

  const {
    isLoading: loadingCards,
    data: cardsData,
    refetch,
    isRefetching: refetchingCards,
  } = useQuery(["cards", activePage], fetchCards, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(cardsData?.data?.count / perPage);

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [
    activePage,
    perPage,
    bank,
    type,
    level,
    bin,
    state,
    country,
    classz,
    zip,
    price,
    ssn,
    dob,
    dl,
    mmn,
    ip,
    minValue,
    maxValue,
  ]);
  //end of fetching products------------------
  // reset filters
  const resetFilters = () => {
    setBank("");
    setState("");
    setCountry("");
    setType("");
    setPerPage(20);
    setLevel("");
    setBin("");
    setClassz("");
    setZip("");
    setPrice("");
    setSsn("");
    setDl("");
    setMmn("");
    setIp("");
  };

  const onSubmitting = (ProductId) => {
    const data = {
      userId: auth?.userId,
      productId: ProductId,
      productType: "card",
    };
    createCart(data);
  };

  function formatCurrency(number) {
    return Number.parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // fetching user cart
  function useShoppingCart() {
    return useQuery(
      [`shoppingCartcard-${auth?.userId}`],
      async () => {
        const { data } = await axios.get(`/cart/${auth?.userId}`);
        return data;
      },
      {
        keepPreviousData: true,
        refetchInterval: 3000,
        // 5 seconds in milliseconds
      }
    );
  }
  const { isLoading: loadingUserCart, data: cartData } = useShoppingCart();

  // func to checkm if a product is in cart
  function isProductInCart(productId) {
    for (let i = 0; i < cartData?.cart?.length; i++) {
      // Check if the current item's productId matches the target productId
      if (cartData?.cart[i]?.productId === productId) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className="bg-light min-h-screen py-4 px-1 md:px-6 shadow-md">
      <h1 className="mb-4 text-center font-bold  ">Cards </h1>
      <div className="flex flex-col ">
        {/* Filters div */}
        <form
          action=""
          className="bg-slate-100 bg-opacity-80 pb-5 md:pb-9 border shadow-sm rounded-t-lg"
        >
          <div className="bg-slate-200 py-6 mb-3 "></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 px-1 md:px-4">
            <div className="flex flex-col gap-">
              <h1>Bank:</h1>
              <input
                type="text"
                className="border-2 py-1 px-2   focus:border-none "
                value={bank}
                onChange={(e) => {
                  setBank(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-col gap-">
              <h1>State:</h1>
              <Select
                options={filterOptions?.state}
                value={state && state.label}
                onChange={(selectOption) => {
                  setState(selectOption?.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-col gap-">
              <h1>Country:</h1>
              <Select
                options={countryOptions}
                value={country && country?.label}
                onChange={(selectOption) => {
                  setCountry(selectOption?.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-col gap-">
              <h1>Class</h1>
              <Select
                options={filterOptions?.cardsClass}
                value={classz && classz?.label}
                onChange={(selectOption) => {
                  setClassz(selectOption?.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-col gap-">
              <h1>Type</h1>
              <Select
                options={filterOptions?.cardsType}
                value={type && type?.label}
                onChange={(selectOption) => {
                  setType(selectOption?.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex flex-col gap-">
              <h1>Level</h1>
              <Select
                options={filterOptions?.cardsLevel}
                value={level && level?.label}
                onChange={(selectOption) => {
                  setLevel(selectOption?.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-col gap-">
              <h1>SSN</h1>
              <select
                className="p-2 bg-light "
                value={ssn}
                onChange={(e) => {
                  setSsn(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select SSN</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="flex flex-col gap-">
              <h1>DOB</h1>
              <select
                className="p-2 bg-light "
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select DOB</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="flex flex-col gap-">
              <h1>DL</h1>
              <select
                className="p-2 bg-light "
                value={dl}
                onChange={(e) => {
                  setDl(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select DL</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="flex flex-col gap-">
              <h1>MMN</h1>
              <select
                className="p-2 bg-light "
                value={mmn}
                onChange={(e) => {
                  setMmn(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select MMN</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="flex flex-col gap-">
              <h1>IP</h1>
              <select
                className="p-2 bg-light "
                value={ip}
                onChange={(e) => {
                  setIp(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select IP</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="flex flex-col w-full  ">
              <label htmlFor="">Bin:</label>
              <input
                type="text"
                className="border-2 py-1 px-2   focus:border-none "
                value={bin}
                onChange={(e) => {
                  setBin(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex flex-col w-full  ">
              <label htmlFor="">Zip:</label>
              <input
                type="text"
                className="border-2 py-1 px-2   focus:border-none "
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-col justify-center gap-2">
              <label>
                Price: ${minValue} - ${maxValue}
              </label>

              <MultiRangeSlider
                min={0}
                max={100}
                step={5}
                ruler={false}
                label={false}
                style={{
                  border: "none",
                  boxShadow: "none",
                  padding: "10px 10px",
                }}
                barInnerColor="#6ba54a"
                minValue={minValue}
                maxValue={maxValue}
                onInput={(e) => {
                  handleInput(e);
                }}
              />
            </div>
            <div className="flex flex-col gap-">
              <h1>Per Page</h1>
              <select
                className="p-2 bg-light "
                value={perPage}
                onChange={(e) => {
                  setPerPage(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select per page</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between mt-5 px-1 md:px-4 ">
            <h1>Total: {cardsData?.data?.count}</h1>
            <h1
              className="bg-primary cursor-pointer text-light py-1 px-5 rounded-md hover:bg-[#064919]  "
              onClick={resetFilters}
            >
              Reset filter
            </h1>
          </div>
        </form>
      </div>
      <div className="my-[30px]">
        <div className="my-3">
          <Pagination
            total={totalPages || 0}
            page={activePage}
            color="green"
            onChange={setPage}
          />
        </div>
        {/* table */}
        <div className="overflow-y-auto my-3 rounded-sm">
          <table className="w-full table-auto border-collapse border border-slate-500 text-light text-sm">
            <thead className="bg-primary bg-opacity-90 ">
              <tr>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Type
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Bin
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Bank
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Class
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Level
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Exp
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Country
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  State
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Zip
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  SSN
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  DOB
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  DL
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  MMN
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  IP
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Seller
                </th>
                <th
                  scope="col"
                  className="border-collapse border border-slate-500 py-2 px-3"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="border-collapse border border-slate-500 py-2 px-3"
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-dark">
              {loadingCards || refetchingCards ? (
                <tr className="flex justify-center py-4 pr-6 items-center">
                  <td colSpan={17} className="text-center ">
                    <PulseLoader color="#6ba54a" size={10} />
                  </td>
                </tr>
              ) : cardsData?.data?.message ? (
                <tr>
                  <td colSpan={17} className="text-gray-800 text-center py-3">
                    {cardsData?.data?.message}
                  </td>
                </tr>
              ) : (
                cardsData?.data?.cards?.map((card, index) => {
                  return (
                    <tr
                      className="odd:bg-gray-50 hover:bg-gray-100"
                      key={index}
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.type}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.bin}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card.bank}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.classz}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.level}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.exp}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.country}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.state}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.zip}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.ssn}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.dob}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.dl}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.mmn}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.ip}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {card?.sellerId}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        ${formatCurrency(card.price)}
                      </td>
                      <td className=" border-collapse border-b border-slate-500 py-3 px-3">
                      {
                          loadingCards || loadingUserCart ?
                          <span>
                            <Loader color="green" size={17} />
                          </span>
                          :
                        <span>

                        {
                          isProductInCart(card?._id) ? 
                          <span>
                            In Cart✅
                          </span>
                          :
                          <span
                          onClick={() => onSubmitting(card?._id)}
                          className="flex gap-2 cursor-pointer bg-primary py-1 px-2 text-center items-center justify-center rounded-md text-light hover:bg-secondary"
                        >
                          <h1 className="">{"Add"}</h1>
                          <CgShoppingCart size={17} />
                        </span>

                        }
                        </span>
                        }
                        
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Cards;
