import React from "react";

function FileOrders(props) {

const handleDownload = (fileName) => {
    window.location.href = `${fileName}`;
  };
 
  function formatCurrency(number) {
    return Number.parseFloat(number).toFixed(2);
  }
  return (
    <div>
      <div className="mb-[30px]">
        <div className="overflow-x-auto mb-3 rounded-md border border-slate-500">
          <table className="w-full text-center table-auto  text-light text-sm">
            <thead className="bg-primary bg-opacity-30 text-dark ">
              <tr>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Id
                </th>

                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Category
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Country
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  State
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Description
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  size
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Download
                </th>
             
              </tr>
            </thead>

            <tbody className="text-dark">
              {!props?.file || props?.file?.length < 1 ? (
                <tr>
                  <td colSpan={8} className="text-gray-800 text-center py-3">
                    No File orders
                  </td>
                </tr>
              ) : (
                props?.file?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="odd:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {index + 1}
                      </td>

                      <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                        {item?.category}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.country}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-2 px-3">
                        {item?.state}
                      </td>

                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.description}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        {item?.size}
                      </td>
                      <td className="border-collapse border-b border-slate-500 py-3 px-3">
                        <a
                          href={`${item?.filePath}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownload(item?.filePath);
                          }}
                          download
                          className="hover:text-primary underline"
                        >
                          Download File
                        </a>
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

export default FileOrders;
