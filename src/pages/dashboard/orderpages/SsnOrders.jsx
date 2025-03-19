import React, { useEffect, useState } from "react";

function SsnOrders(props) {
  const [todaysOrders, setTodaysOrders] = useState([]);
  const [yesterdaysOrders, setYesterdaysOrders] = useState([]);
  const [earlierOrders, setEarlierOrders] = useState([]);
  //  sorting orders
  useEffect(() => {
    // Convert date strings to Date objects and split into categories.
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayOrders = [];
    const yesterdayOrders = [];
    const earlierOrders = [];

    props?.ssn?.forEach((order) => {
      const purchaseDate = new Date(order.purchaseDate);
      if (purchaseDate.toDateString() === today.toDateString()) {
        todayOrders.push(order);
      } else if (purchaseDate.toDateString() === yesterday.toDateString()) {
        yesterdayOrders.push(order);
      } else {
        earlierOrders.push(order);
      }
    });

    setTodaysOrders(todayOrders);
    setYesterdaysOrders(yesterdayOrders);
    setEarlierOrders(earlierOrders);
  }, [props?.ssn]);

  // download orders function.
  const downloadOrders = (orders) => {
    // Create a text representation of the orders
    const orderText =
      "SSN/DOB Orders \n\n" +
      orders
        ?.map((order, index) => {
          return `Order ID: ${index + 1}\nName:${order?.firstName || ""}  ${
            order?.lastName || ""
          }  \nSSN:${order?.ssn || ""}\nDOB:${order?.dob?.split('T')[0] || ""}\nAddress:${
            order?.address || ""
          }\nCity:${order?.city || ""}\nState: ${order?.state || ""}\nZip:${
            order?.zip || ""
          }\nEmail:${order?.email || ""}\nEmail Pass:${
            order?.emailPass || ""
          }\nfa Uname:${order?.faUname || ""}\nfa Pass:${
            order?.faPass || ""
          }\nBackup code:${order?.backupCode || ""}\n Security Q&A:${
            order?.securityQa || ""
          }\nDescription:  ${order.description || ""}\nCS:  ${
            order.cs || ""
          }\nPurchase Date:  ${
            order.purchaseDate || ""
          } \n\n_______________________________________ \n`;
        })
        .join("\n");

    // Create a Blob containing the text
    const blob = new Blob([orderText], { type: "text/plain" });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "SSN orders.txt";

    // Simulate a click to trigger the download
    link.click();
  };

  return (
    <div>
      <div className="mb-[30px]">
        <div className="overflow-x-auto mb-3">
          <div>
            <h1 className="text- text-light text-center my-2">
              {!props?.ssn?.length && "No Orders!"}
            </h1>
          </div>

          {todaysOrders.length > 0 && (
            <div className="overflow-x-auto mb-3">
              <div className="flex items-center gap-3">
                <h2 className="my-2 text-light pb-2">Todays Orders</h2>
                <div>
                  <button
                    className="text-sm bg-gray-200 px-2 py-1 rounded-md  "
                    onClick={() => {
                      downloadOrders(todaysOrders);
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>{" "}
              <table className="w-full text-center table-auto border-collapse border border-slate-500 text-light text-sm">
                {tableHeader}
                <tbody className="text-dark">
                  {todaysOrders.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="odd:bg-[#595a59] hover:bg-gray-600 text-light text-center "
                      >
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.base}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.firstName || ""}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.dob?.split("-")[0]}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.description}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.state}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item.city}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.zip}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.ssn}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.address}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.email}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.emailPass}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.faUname}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.faPass}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.backupCode}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.securityQa}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {yesterdaysOrders.length > 0 && (
            <div className="overflow-x-auto mb-3">
              <div className="flex items-center gap-3">
                <h2 className="my-2 text-light pb-2">Yesterday Orders</h2>
                <div>
                  <button
                    className="text-sm bg-gray-200 px-2 py-1 rounded-md  "
                    onClick={() => {
                      downloadOrders(yesterdaysOrders);
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
              <table className="w-full text-center table-auto border-collapse border border-slate-500 text-light text-sm">
                {tableHeader}
                <tbody className="text-dark">
                  {yesterdaysOrders.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="odd:bg-[#595a59] hover:bg-gray-600 text-light text-center "
                      >
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.base}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.firstName || ""}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.dob?.split("-")[0]}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.description}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.state}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item.city}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.zip}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.ssn}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.address}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.email}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.emailPass}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.faUname}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.faPass}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.backuCode}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.securityQa}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {earlierOrders.length > 0 && (
            <div className="overflow-x-auto mb-3">
              <div className="flex items-center gap-3">
                <h2 className="my-2 pt-2 text text-light">
                  {!todaysOrders?.length && !yesterdaysOrders?.length
                    ? "All"
                    : "Earlier"}{" "}
                  Orders
                </h2>
                <div>
                  <button
                    className="text-  bg-gray-200 px-2 py-1 rounded-md  "
                    onClick={() => {
                      downloadOrders(earlierOrders);
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>

              <table className="w-full text-center table-auto border-collapse border border-slate-500 text-light text-sm rounded-md">
                {tableHeader}
                <tbody className="text-dark">
                  {earlierOrders.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="odd:bg-[#595a59] hover:bg-gray-600 text-light text-center "
                      >
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.base}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.firstName || ""}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.dob?.split("-")[0]}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.description}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.state}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item.city}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.zip}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.ssn}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.address}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.email}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.emailPass}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.faUname}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.faPass}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.backuCode}
                        </td>
                        <td className="border-collapse border-b border-slate-500 py-2 px-3">
                          {item?.securityQa}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SsnOrders;
const tableHeader = (
  <thead className="bg-primary/70 text-light ">
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
        Description
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
    </tr>
  </thead>
);
