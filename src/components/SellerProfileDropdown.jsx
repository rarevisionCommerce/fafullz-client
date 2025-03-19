import { useState } from 'react'
import {  Link, useNavigate } from 'react-router-dom'

import {HiOutlineKey} from 'react-icons/hi'
import {BiLogOut} from 'react-icons/bi'
import useLogout from '../hooks/useLogout'
// import drop down items

function SellerProfileDropdown() {
  const [dropdown, setDropdown] = useState(true);
  const navigate = useNavigate();

  const logOut = useLogout();

  const signOut = async () => {
    await logOut();
    navigate('/');
}

  const dropDownItems = [

    {
        name: 'Change password',
        path: '/seller-dash/change-password',
        icon:<HiOutlineKey />
    },
    {
        name: 'Logout',
        path: '/',
        icon:<BiLogOut />
    },
  ]

  return (
    <div
      className={
        dropdown
          ? 'bg-secondary text-light mt-9 right-1 md:right-3 w-[250px] h-[120px] shadow-md   absolute z-20 '
          : ''
      }
    >
      <ul className="flex flex-col gap-2  ">
        {dropDownItems.map((item, index) => {
            if(item?.name === "Logout"){
                return(
                    <div>
              <li
                className="  p-1 flex px-2 gap-3 items-center text-sm hover:bg-primary hover:bg-opacity-80 hover:text-gray-100 "
                onClick={() => {
                  setDropdown(!dropdown)
                  signOut();
                }}
              >
                <h1>{item?.icon}</h1>
                <h1>{item?.name}</h1>
              </li>
            </div>

                )
            }
          return (
            <Link to={item.path} key={index}>
              <li
                className="  py-2 flex gap-3 items-center px-2 text-[13px] hover:bg-primary hover:bg-opacity-80 hover:text-gray-100 "
                onClick={() => {
                  setDropdown(false)
                }}
              >
                <h1>{item?.icon}</h1>
                <h1>{item.name}</h1>
              </li>
            </Link>
          )
        })}
      </ul>
    </div>
  )
}
export default SellerProfileDropdown
