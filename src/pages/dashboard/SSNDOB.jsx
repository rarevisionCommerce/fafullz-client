import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import PulseLoader from "react-spinners/PulseLoader";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Loader, Pagination } from "@mantine/core";
import filterOptions from "../filterOptions";
import countryList from "react-select-country-list";
import { CgShoppingCart } from "react-icons/cg";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import MultiRangeSlider from "multi-range-slider-react";
import { axiosPrivate } from "../../api/axios";

function SSNDOB() {
  const axios = useAxiosPrivate();

  const date = new Date();
  const currentYear = date.getFullYear();

  const countryOptions = useMemo(() => countryList().getData(), []);
  const { auth } = useAuth();

  const [showFilters, setShowFilters] = useState(true);

  const [perPage, setPerPage] = useState(300);
  const [base, setBase] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country1, setCountry1] = useState("");
  const [dob, setDob] = useState("");
  const [cs, setCs] = useState("");
  const [name, setName] = useState("");
  const [activePage, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [slider2Values, setSlider2Values] = useState([1910, currentYear]);
  const [minValue, set_minValue] = useState(1910);
  const [maxValue, set_maxValue] = useState(currentYear);
  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };
  console.log(base);

  const fetchFiles = () => {
    return axios.get(
      `/ssn?page=${activePage}&perPage=${perPage}&base=${
        base?.base || ""
      }&city=${city}&zip=${zip}&country=${country1}&dob=${minValue}&dobMax=${maxValue}&cs=${cs}&name=${name}&state=${state}`
    );
  };

  const {
    isLoading: loadingSsns,
    data: ssnData,
    refetch,
    isRefetching: refetchinSsn,
  } = useQuery(["ssns", activePage], fetchFiles, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(ssnData?.data?.count / perPage);

  // pagination refetch
  useEffect(() => {
    // queryClient.invalidateQueries(['ssns', activePage])
    refetch();
  }, [
    activePage,
    perPage,
    base,
    state,
    city,
    zip,
    country1,
    dob,
    cs,
    minValue,
    maxValue,
    name,
  ]);
  //end of fetching products------------------

  // reset filters
  const resetFilters = () => {
    setBase("");
    setCity("");
    setCountry1("");
    setState("");
    setPerPage(20);
    setZip("");
    setDob("");
    setCs("");
    setName("");
  };
  //get all bases
  const getBases = () => {
    return axios.get(`/bases`);
  };

  const { isLoading: loadingBases, data: basesData } = useQuery(
    ["bases-"],
    getBases,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    }
  );
  // making base optopns
  const baseOptions = [{}];

  basesData?.data?.bases?.map((base, index) => {
    baseOptions.push({
      label: base.base,
      value: { base: base.base, showDescription: base.showDescription },
    });
  });
  //end...........

  // sending cart details
  const createCart = (cartData) => {
    return axios.post("/cart", cartData);
  };

  const {
    mutate: cartMutate,
    isLoading: loadingCart,
    error,
  } = useMutation(createCart, {
    onSuccess: (response) => {
      const text = response?.data.message;
      toast.success(text);
      queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
      queryClient.invalidateQueries([`shoppingCartsnn-${auth?.userId}`]);
    },
    onError: (err) => {
      const text = err?.response.data.message;

      toast.error(text);
      if (!err.response.data.message) {
        toast.error("something went wrong");
      }
    },
  });

  const onSubmitting = (ProductId) => {
    const data = {
      userId: auth?.userId,
      productId: ProductId,
      productType: "ssn",
    };
    cartMutate(data);
  };
  // end of sending  details

  // fetching user cart
  function useShoppingCart() {
    return useQuery(
      [`shoppingCartsnn-${auth?.userId}`],
      async () => {
        const { data } = await axios.get(`/cart/${auth?.userId}`);
        return data;
      },
      {
        keepPreviousData: true,
        refetchInterval: 3000,
        // 5 seconds in milliseconds,
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
    <div className="">
      <div className="bg-[#696a62] w-full rounded-t-md flex items-center gap-2 ">
        <p className="text-light px-2 py-3">Fullz </p>
        <p
          onClick={() => {
            setShowFilters(!showFilters);
          }}
          className="text-primary cursor-pointer"
        >
          [{showFilters ? "Hide filters" : "Show Filters"}]
        </p>
      </div>

      {showFilters && (
        <div className="border border-[#4b4b4b] bg-dark   rounded-b-md py-3 px-2">
          {/* filters */}
          <div className="grid md:grid-cols-4 gap-8 content-center ">
            <div className="flex flex-col w-full gap-2  ">
              <label htmlFor="" className="text-light ">
                Base:
              </label>
              <Select
                options={baseOptions}
                value={base && base.label}
                onChange={(selectOption) => {
                  setBase(selectOption?.value);
                }}
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="" className="text-light ">
                State:
              </label>
              <Select
                options={filterOptions?.state}
                value={state && state.label}
                onChange={(selectOption) => {
                  setState(selectOption?.value);
                }}
              />
            </div>
            <div className="flex flex-col w-full  ">
              <label htmlFor="" className="text-light ">
                City:
              </label>
              <input
                type="text"
                className="border-2 py-1 px-2   focus:border-none "
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col w-full  ">
              <label htmlFor="" className="text-light ">
                Zip:
              </label>
              <input
                type="text"
                className="border-2 py-1 px-2   focus:border-none "
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="" className="text-light ">
                Country:
              </label>
              <Select
                options={countryOptions}
                value={country1 && country1.label}
                onChange={(selectOption) => {
                  setCountry1(selectOption?.value);
                }}
              />
            </div>
            <div>
              <label className="text-light ">
                DOB: {minValue} - {maxValue}
              </label>

              <MultiRangeSlider
                min={1910}
                max={2025}
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

            <div className="flex flex-col w-full  ">
              <label htmlFor="" className="text-light ">
                Name:
              </label>
              <input
                type="text"
                className="border-2 py-1 px-2   focus:border-none "
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>

            <div className="flex justify-between items-center ">
              <h1
                className="bg-primary   cursor-pointer text-light py-1 px-5 rounded-md hover:bg-[#064919]  "
                onClick={resetFilters}
              >
                Reset filter
              </h1>
            </div>
          </div>
          {/* end of filters */}
        </div>
      )}
      <div className="mt-10 pb-2">
        <div className="">
          <Pagination
            total={totalPages || 0}
            page={activePage}
            color="yellow"
            onChange={setPage}
          />
        </div>
      </div>

      {/* table */}
      <div className="overflow-y-auto rounded-lg mt-1 bg-[#414036]">
        <table className="w-full table-auto border-collapse border border-slate-500 text-[#FFF] text-sm">
          {/* table header */}
          <thead className="bg-primary/70 bg-opacity-90 ">
            <tr>
              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                Base
              </th>
              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                Name
              </th>
              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                DOB
              </th>
              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                State
              </th>
              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                City
              </th>
              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                Zip
              </th>

              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                SSN
              </th>
              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                Address
              </th>

              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                Email
              </th>
              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                Email_Pass
              </th>
              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                FAUname
              </th>
              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                FAPass
              </th>
              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                Backup_Code
              </th>
              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                Security_Q&A
              </th>
              <th
                scope="col"
                className={`${
                  !base?.showDescription && "hidden"
                } border-collapse border border-slate-500 py-2 px-3`}
              >
                Description
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
                Enrollment
              </th>
              <th
                scope="col"
                className="border-collapse border border-slate-500 py-2 px-3"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-dark ">
            {loadingSsns || refetchinSsn ? (
              <tr className="">
                <td colSpan={12} className="text-center pl-[50%] py-5">
                  <Loader color="#ff9c33" size={25} />
                </td>
              </tr>
            ) : ssnData?.data?.message ? (
              <tr>
                <td colSpan={7} className="text-gray-800 text-center py-3">
                  {ssnData?.data?.message}
                </td>
              </tr>
            ) : (
              ssnData?.data?.ssns?.map((account, index) => {
                return (
                  <tr
                    key={index}
                    className="odd:bg-[#595a59] hover:bg-gray-600 text-light text-center "
                  >
                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.price?.base}
                    </td>
                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.firstName || ""}
                    </td>
                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.dobYear}
                    </td>
                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.state}
                    </td>
                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account.city}
                    </td>
                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.zip}
                    </td>

                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.ssn ? "✅" : "❌"}
                    </td>
                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.address ? "✅" : "❌"}
                    </td>

                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.email ? "✅" : "❌"}
                    </td>
                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.emailPass ? "✅" : "❌"}
                    </td>
                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.faUname ? "✅" : "❌"}
                    </td>
                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.faPass ? "✅" : "❌"}
                    </td>
                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.backupCode ? "✅" : "❌"}
                    </td>
                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.securityQa ? "✅" : "❌"}
                    </td>
                    <td
                      className={`${
                        !base?.showDescription && "hidden"
                      } border-collapse border-b border-slate-500 py-2 px-3`}
                    >
                      {account?.description}
                    </td>
                    <td
                      className={` border-collapse border-b border-slate-500 py-2 px-3`}
                    >
                      ${account?.price?.price}
                    </td>
                    <td className="border-collapse border-b border-slate-500 py-2 px-3">
                      {account?.enrollment ? "✅" : "❌"}
                    </td>
                    <td className=" border-collapse border-b border-slate-500 py-3 px-3">
                      {loadingCart ? (
                        <span>
                          <Loader color="green" size={12} />
                        </span>
                      ) : (
                        <span>
                          {isProductInCart(account?._id) ? (
                            <span>In Cart✅</span>
                          ) : (
                            <span
                              onClick={() => onSubmitting(account?._id)}
                              className="flex gap-2 cursor-pointer bg-primary py- px-2 text-center items-center justify-center rounded-md text-light hover:bg-secondary"
                            >
                              <h1 className="">{"Add"}</h1>
                              <CgShoppingCart size={17} />
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="py-3 px-3 flex justify-start mt-2">
          <Pagination
            total={totalPages || 0}
            page={activePage}
            color="yellow"
            onChange={setPage}
          />
          <div className="flex justify-center items-center ml-4 text-light">
            <p>Showing </p>
            <select
              name=""
              value={perPage}
              id=""
              className="px-1 py-1 mx-2 rounded-md border bg-dark "
              onChange={(e) => {
                setPerPage(e.target.value);
              }}
            >
              <option value={300}>300</option>
              <option value={330}>330</option>
              <option value={350}>350</option>
            </select>
            <p>Per page</p>
          </div>
        </div>

        {/* en of header */}
      </div>
    </div>
  );
}

export default SSNDOB;
