import React from 'react'

function CardsOrders() {
  return (
    <div>
         <div className="mb-[30px]">
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-center table-auto border-collapse border border-slate-500 text-light text-sm">
              <thead className="bg-primary bg-opacity-90 ">
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Id
                </th>

                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Info
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Date
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Category
                </th>
                <th className="border-collapse border border-slate-500 py-2 px-3">
                  Price
                </th>
              </thead>

              <tbody className="text-dark">
                <tr className="odd:bg-gray-50 hover:bg-gray-100">
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    1
                  </td>

                  <td className="border-collapse border-b  border-slate-500 py-2 px-3">
                    ⚡ FRESH HIGH CS FULLZ ⚡
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    11/2/2022
                  </td>
                  <td className="border-collapse border-b border-slate-500 py-2 px-3">
                    SSN
                  </td>

                  <td className="border-collapse border-b border-slate-500 py-3 px-3">
                    20$
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> 
    </div>
    
  )
}

export default CardsOrders