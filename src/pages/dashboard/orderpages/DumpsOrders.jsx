import React from "react";

function DumpsOrders(props) {

  function formatCurrency(number) {
    return Number.parseFloat(number).toFixed(2);
  }
 // download orders function.
 const downloadOrders = () => {
  // Create a text representation of the orders
  const orderText = 'Dumps Orders \n\n'+ props?.dump
    ?.map((order, index) => {
      return `Order ID: ${index + 1}\nBin: ${order.bin || ''}\nTrack 1:  ${order.track1 || ''}\nTrack 2:  ${order.track2 || ''}\nCVC:${
        order?.svc || ''
      }\nEXP:${
        order?.exp || ''
      }\nBank:${
        order?.Bank || ''
      }\nPurchase Date:${
        order?.purchaseDate || ''
      } \n\n_______________________________________ \n`;
    })
    .join("\n");

  // Create a Blob containing the text
  const blob = new Blob([orderText], { type: "text/plain" });

  // Create a download link
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Dump orders.txt";

  // Simulate a click to trigger the download
  link.click();
};


  return (
    <div>
      <div className="mb-[30px]">
      <div>
          <button
            className="my-2 bg-secondary text-light px-3 py-1 rounded-md"
            onClick={() => {
              downloadOrders();
            }}
          >
            Download Orders
          </button>
        </div>
        <div className="overflow-x-auto mb-3 rounded-md  border border-slate-500">
          <table className="w-full text-center table-auto  text-light text-sm">
            <thead className="bg-primary bg-opacity-30  text-dark ">
              <tr>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Id
                </th>

                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Bin
                </th>
                   <th className="border-collapse border border-slate-500 py-2 px-3">
                  Track 1
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Track 2
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  SVC
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  EXP
                </th>
                  <th className="border-collapse border border-slate-500 py-2 px-3">
                  Bank
                </th>
               
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Checker
                </th>
                
              
             
              </tr>
            </thead>

            <tbody className="text-dark">
              {!props?.dump || props?.dump?.length < 1 ? (
                <tr>
                  <td colSpan={10} className="text-gray-800 text-center py-3">
                    No Dump orders
                  </td>
                </tr>
              ) : (
                props?.dump?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="odd:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {item?.bin}
                      </td>
                       <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.track1}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.track2}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.svc}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.exp}
                      </td>
                       <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.bank}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        Unavailable
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

export default DumpsOrders;
