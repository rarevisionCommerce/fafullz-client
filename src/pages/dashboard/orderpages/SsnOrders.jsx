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

  const instructions =
    "INSTRUCTIONS on how to use fafullz.com Matched Fullz.\n\n" +
    "- Go to FSAID Website\n" +
    '- Enter the "Email" as username on the login screen\n' +
    '- Enter "FA Pass" as Password on the login screen\n\n' +
    "Option 1:\n" +
    "Login using Email Verification Code:\n" +
    "- Go to mail.tm website\n" +
    "- Head over to the top right corner and click on profile then login\n" +
    "- Enter the Email and Email Pass and login\n" +
    "You will receive your code there then proceed.\n\n" +
    "Option 2 (Recommended):\n" +
    "Login using Backup Code:\n" +
    '- Instead of proceeding with "Send Code"; proceed with "Help me access my account"\n' +
    '- Select the "Backup Code & Challenge Questions" and click "Enter Code"\n' +
    '- Enter the Backup Code from the fullz and click "Continue"\n' +
    "- Enter the answers from the fullz SecurityQ&A\n" +
    "- Then proceed.\n\n" +
    "Once in, remember to change the email to your own, update the address and the username.";

  // download orders function.
  const downloadOrders = (orders) => {
    // Create a text representation of the orders
    const orderText =
      "SSN/DOB Orders \n\n" +
      instructions +
      orders
        ?.map((order, index) => {
          return `Order ID: ${index + 1}\nName:${order?.firstName || ""}  ${
            order?.lastName || ""
          }  \nSSN:${order?.ssn || ""}\nDOB:${
            order?.dob?.split("T")[0] || ""
          }\nAddress:${order?.address || ""}\nCity:${
            order?.city || ""
          }\nState: ${order?.state || ""}\nZip:${order?.zip || ""}\nEmail:${
            order?.email || ""
          }\nEmail Pass:${order?.emailPass || ""}\nfa Uname:${
            order?.faUname || ""
          }\nfa Pass:${order?.faPass || ""}\nBackup code:${
            order?.backupCode || ""
          }\n Security Q&A:${order?.securityQa || ""}\nDescription:  ${
            order.description || ""
          }\nCS:  ${order.cs || ""}\nPurchase Date:  ${
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

  /**
   * Function to download orders data as CSV
   * @param {Array} orders - Array of order objects
   */
  const downloadOrdersAsCSV = (orders) => {
    // Verify inputs
    if (!Array.isArray(orders) || orders.length === 0) {
      console.error("Orders data is empty or invalid");
      return;
    }

    // Create a copy of the orders with the excluded fields removed
    const filteredOrders = orders.map((order) => {
      const orderCopy = { ...order };
      // Remove the excluded fields
      delete orderCopy.sellerId;
      delete orderCopy.base;
      delete orderCopy._id;
      delete orderCopy.price;
      delete orderCopy.status;
      delete orderCopy.isPaid;
      delete orderCopy.productType;
      delete orderCopy.__v;
      delete orderCopy.createdAt;
      delete orderCopy.updatedAt;
      return orderCopy;
    });

    // Create CSV header from the keys of the first filtered order object
    const headers = Object.keys(filteredOrders[0]);

    // Create CSV content
    let csvContent = headers.join(",") + "\n";

    // Add data rows
    filteredOrders.forEach((order) => {
      const row = headers
        .map((header) => {
          // Format the value properly for CSV
          const value = order[header];
          // Handle special cases, null, undefined, and escape commas and quotes
          if (value === null || value === undefined) {
            return "";
          }

          // Convert to string and escape quotes by doubling them
          const stringValue = String(value).replace(/"/g, '""');

          // Wrap value in quotes if it contains commas, quotes, or newlines
          if (
            stringValue.includes(",") ||
            stringValue.includes('"') ||
            stringValue.includes("\n")
          ) {
            return `"${stringValue}"`;
          }

          return stringValue;
        })
        .join(",");

      csvContent += row + "\n";
    });

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "orders_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Example usage:
  // downloadOrdersAsCSV(orders);

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
                <div className="flex gap-2 items-center ">
                  <button
                    className="text-sm bg-gray-200 px-2 py-1 rounded-md  "
                    onClick={() => {
                      downloadOrders(todaysOrders);
                    }}
                  >
                    Download
                  </button>
                  <button
                    className="text-sm bg-gray-200 px-2 py-1 rounded-md  "
                    onClick={() => {
                      downloadOrdersAsCSV(todaysOrders);
                    }}
                  >
                    Download csv
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
                <div className="flex gap-2 items-center ">
                  <button
                    className="text-sm bg-gray-200 px-2 py-1 rounded-md  "
                    onClick={() => {
                      downloadOrders(yesterdaysOrders);
                    }}
                  >
                    Download
                  </button>
                  <button
                    className="text-sm bg-gray-200 px-2 py-1 rounded-md  "
                    onClick={() => {
                      downloadOrdersAsCSV(yesterdaysOrders);
                    }}
                  >
                    Download csv
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
                <div className="flex gap-2 items-center ">
                  <button
                    className="text-sm bg-gray-200 px-2 py-1 rounded-md  "
                    onClick={() => {
                      downloadOrders(earlierOrders);
                    }}
                  >
                    Download
                  </button>
                  <button
                    className="text-sm bg-gray-200 px-2 py-1 rounded-md  "
                    onClick={() => {
                      downloadOrdersAsCSV(earlierOrders);
                    }}
                  >
                    Download csv
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
