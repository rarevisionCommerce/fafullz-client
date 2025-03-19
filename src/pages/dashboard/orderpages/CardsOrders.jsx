import React, { useEffect, useState } from "react";

function CardsOrders(props) {
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

    props?.card?.forEach((order) => {
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
  }, [props?.card]);



  // download orders function.
  const downloadOrders = (orders) => {
    // Create a text representation of the orders
    const orderText =
      "Card Orders \n\n" +
      orders?.map((order, index) => {
          return `Order ID: ${index + 1}\nCCNUM:${order?.ccnum || ''}\nExp:${order?.exp || ''}\nCVV:${order?.cvv || ''}\nName:${order?.name}\nAddress:${order?.address}\nCity:${
            order?.city || ''
          }\nState:${
            order?.State || ''
          }\nZip:${
            order?.zip || ''
          }\nPhone:${
            order?.phone || ''
          }\nEmail:${
            order?.email || ''
          }\nPassword:${
            order?.password || ''
          }\nDL:${
            order?.dl || ''
          }\nSSN:${order?.ssn || ''}\nDOB:${order?.dob || ''}\nMMN:${order?.mmn || ''}\nIP: ${order?.ip || ''}\nPurchase Date: ${order?.purchaseDate || ''} \n\n_______________________________________ \n`;
        })
        .join("\n");

    // Create a Blob containing the text
    const blob = new Blob([orderText], { type: "text/plain" });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Card orders.txt";

    // Simulate a click to trigger the download
    link.click();
  };

  return (
    <div>
      <div className="mb-[30px]">
     
        <div className="overflow-x-auto mb-3">
        <div className="overflow-x-auto mb-3 ">
          
          <div>
            <h1 className="text-sm text-center my-2">{!props?.card?.length && 'No Orders!' }</h1>
          </div>

          {todaysOrders.length > 0 && (
            <div  className="overflow-x-auto mb-3 ">
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
                        {item?.ccnum}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.exp}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.cvv}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.name}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.address}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.city || "city"}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.state}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.zip}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.phone}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.email}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.password}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.dl}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.ssn}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.dob}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.mmn}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.ip}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        Unavailable
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
                        {item?.ccnum}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.exp}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.cvv}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.name}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.address}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.city || "city"}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.state}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.zip}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.phone}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.email}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.password}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.dl}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.ssn}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.dob}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.mmn}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.ip}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        Unavailable
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
                        {item?.ccnum}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.exp}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.cvv}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.name}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.address}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.city || "city"}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.state}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.zip}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.phone}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.email}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.password}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.dl}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.ssn}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.dob}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.mmn}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.ip}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        Unavailable
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
    </div>
  );
}

export default CardsOrders;

const tableHeader = (
  <thead className="bg-primary  text-dark bg-opacity-30 overflow-auto ">
  <tr>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      Id
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      CCNUM
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      Exp
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      CVV
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      Name
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      Address
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      City
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      State
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      Zip
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      Phone
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      Email
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      Password
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      DL
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      SSN
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      Dob
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      MMN
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      IP
    </th>
    <th className="border-collapse border border-slate-500 py-2 px-3">
      Checker
    </th>
  </tr>
</thead>
);
