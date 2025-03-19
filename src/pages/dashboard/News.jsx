import React from 'react'

function News() {
  return (
    <div className='p-4'>
        <div className='border border-[#3c3c36] text-light  bg-[#343434] shadow-md rounded-md '>
            <div className='bg-[#3e3e3b] py-3 my-4 mx-3 rounded-md'>
                <h1 className='mx-2'>Format</h1>

            </div>

            {/* The table  */}
            <div className='mx-3 my-2 pb-6 overflow-x-auto'>
                <table className='w-full table-auto border-collapse border border-slate-900 text-sm'>
                    <thead>
                     <tr>
                    <th className='border-collapse border border-slate-500 py-2 px-3'>Base</th>
                    <th className='border-collapse border border-slate-500 py-2 px-3'>Format</th>
                    <th className='border-collapse border border-slate-500 py-2 px-3'>Price $</th>
                    </tr>   
                    </thead>

                    <tbody>
                        <tr className='hover:bg-slate-700'>
                        <td className="border border-slate-500 py-2 px-1 font-semibold"> USA TOP BASE, DL </td>
                        <td className="border border-slate-500 py-2 px-1">  NAME|SSN|DOB|Address|City|State|ZIP|USA|DL/DL state</td>
                        <td className="border border-slate-500 py-2 px-1 font-semibold">2.5 </td>
                        </tr>

                        <tr className='hover:bg-slate-700'>
                        <td className="border border-slate-500 py-2 px-1 font-semibold">  Private fresh fullz </td>
                        <td className="border border-slate-500 py-2 px-1">    SSN|Name|USA|Address|City|State|ZIP|DOB|</td>
                        <td className="border border-slate-500 py-2 px-1 font-semibold">0.5 - 1 </td>
                        </tr>

                        <tr className='hover:bg-slate-700'>
                        <td className="border border-slate-500 py-2 px-1 font-semibold">  USA Full info + DL</td>
                        <td className="border border-slate-500 py-2 px-1">    Name|SSN|DOB|DL|DL State|Address|USA|City|State IN|ZIP|Phone|Email</td>
                        <td className="border border-slate-500 py-2 px-1 font-semibold">1.5 </td>
                        </tr>

                        <tr className='hover:bg-slate-700'>
                        <td className="border border-slate-500 py-2 px-1 font-semibold">  Federal base USA </td>
                        <td className="border border-slate-500 py-2 px-1">    Name|SSN|DOB|Address|City|State|ZIP|USA</td>
                        <td className="border border-slate-500 py-2 px-1 font-semibold">2 </td>
                        </tr>

                        <tr className='hover:bg-slate-700'>
                        <td className="border border-slate-500 py-2 px-1 font-semibold">  BIG UPDATE, BIG UPDATE 2 </td>
                        <td className="border border-slate-500 py-2 px-1">    Name|Address|City|State|ZIP|SSN|DOB|USA</td>
                        <td className="border border-slate-500 py-2 px-1 font-semibold">0.55 </td>
                        </tr>

                        <tr className='hover:bg-slate-700'>
                        <td className="border border-slate-500 py-2 px-1 font-semibold">  USA FULL INFO + CS (Credit score) </td>
                        <td className="border border-slate-500 py-2 px-1">   Name|Age|DOB|SSN|Address|City|State|ZIP|CS|USA CS - Credit score </td>
                        <td className="border border-slate-500 py-2 px-1 font-semibold">8-12 </td>
                        </tr>

                    </tbody>
                </table>

            </div>
        </div>
    </div>
  )
}

export default News