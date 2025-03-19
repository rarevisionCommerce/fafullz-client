import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TextNowOrders(props) {
  function getHourDifference(dateString1) {
    const date1 = new Date(dateString1)?.toISOString()?.slice(0, 16);
    const date2 = new Date()?.toISOString()?.slice(0, 16);
    if (!dateString1) {
      return 25;
    }
    const diffInMs = Math.abs(new Date(date2) - new Date(date1));
    if (isNaN(diffInMs)) {
      return 25;
    }
    const diffInHours = diffInMs / (1000 * 60 * 60); // convert to hours

    if (isNaN(diffInHours)) {
      return 25;
    }
    return diffInHours.toFixed(2); // round off to 2 decimal places
  }
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

    props?.mail?.forEach((order) => {
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
  }, [props?.mail]);

  // download orders function.
  const downloadOrders = (orders) => {
    // Create a text representation of the orders
    const orderText =
      "TextNow/ Mail Orders \n\n" +
      orders
        ?.map((order, index) => {
          return `Order ID: ${index + 1}\nEmail: ${
            order?.email || ""
          }\nPassword:  ${order?.password || ""}\nRecovery Email:  ${
            order?.recoveryMail || ""
          }\nPurchase date:  ${
            order?.purchaseDate || ""
          } \n\n_______________________________________ \n`;
        })
        .join("\n");

    // Create a Blob containing the text
    const blob = new Blob([orderText], { type: "text/plain" });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "mails orders.txt";

    // Simulate a click to trigger the download
    link.click();
  };

  return (
    <div>
      <div className="mb-[30px]">
        <div className="overflow-x-auto mb-3">
          
          <div>
            <h1 className="text-sm text-center my-2">
              {!props?.mail?.length && "No Orders!"}
            </h1>
          </div>
          {todaysOrders.length > 0 && (
            <div  className="overflow-x-auto mb-3">
              <div className="flex items-center gap-3">
                <h2 className="my-2 text-sm">Todays Orders</h2>
                <div>
                  <button className="text-xs bg-gray-200 px-2 py-1 rounded-md  "
                  onClick={()=>{
                    downloadOrders(todaysOrders) 
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
                      className="odd:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {item?.email}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.password}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.recoveryMail}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {!item?.purchaseDate ||
                        getHourDifference(item?.purchaseDate) > 24 ? (
                          ""
                        ) : (
                          <Link
                            to={`/dash/refund-request/mail/${item?._id}`}
                            className="bg-primary text-light px-3 py-1 rounded-md  hover:bg-secondary"
                          >
                            Refund
                          </Link>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {yesterdaysOrders.length > 0 && (
            <div  className="overflow-x-auto mb-3">
              <div className="flex items-center gap-3">
                <h2 className="my-2 text-sm">Yesterday Orders</h2>
                <div>
                  <button className="text-xs bg-gray-200 px-2 py-1 rounded-md  "
                   onClick={()=>{
                    downloadOrders(yesterdaysOrders) 
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
                      className="odd:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {item?.email}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.password}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.recoveryMail}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {!item?.purchaseDate ||
                        getHourDifference(item?.purchaseDate) > 24 ? (
                          ""
                        ) : (
                          <Link
                            to={`/dash/refund-request/mail/${item?._id}`}
                            className="bg-primary text-light px-3 py-1 rounded-md  hover:bg-secondary"
                          >
                            Refund
                          </Link>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {earlierOrders.length > 0 && (
            <div  className="overflow-x-auto mb-3">
              <div className="flex items-center gap-3">
                <h2 className="my-2 text-sm">{(!todaysOrders?.length && !yesterdaysOrders?.length)? 'All':'Earlier'} Orders</h2>
                <div>
                  <button className="text-xs bg-gray-200 px-2 py-1 rounded-md  "
                   onClick={()=>{
                    downloadOrders(earlierOrders) 
                  }}
                  >
                    Download 
                  </button>
                </div>
              </div>

              <table className="w-full text-center table-auto border-collapse border border-slate-500 text-light text-sm">
              {tableHeader}
                <tbody className="text-dark">
                  {earlierOrders.map((item, index) => {
                    return (
                      <tr
                      key={index}
                      className="odd:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {item?.email}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.password}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.recoveryMail}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {!item?.purchaseDate ||
                        getHourDifference(item?.purchaseDate) > 24 ? (
                          ""
                        ) : (
                          <Link
                            to={`/dash/refund-request/mail/${item?._id}`}
                            className="bg-primary text-light px-3 py-1 rounded-md  hover:bg-secondary"
                          >
                            Refund
                          </Link>
                        )}
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

export default TextNowOrders;

const tableHeader = (
  <thead className="bg-primary bg-opacity-30 text-dark ">
    <tr>
      <th className="border-collapse border border-slate-500 py-2 px-3">Id</th>

      <th className="border-collapse border border-slate-500 py-2 px-3">
        Email
      </th>
      <th className="border-collapse border border-slate-500 py-2 px-3">
        Password
      </th>

      <th className="border-collapse border border-slate-500 py-2 px-3">
        Recovery Email
      </th>
      <th className="border-collapse border border-slate-500 py-2 px-3"></th>
    </tr>
  </thead>
);
