import React, { useState, useEffect } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth'
import Select from 'react-select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
// import ssnSample from '../../assets/Downloads/sample-ssncsv.csv';

function CardsCsvUpload() {
const {auth} = useAuth()
  const [singleFile, setSingleFile] = useState('')
  const sellerId = auth?.jabberId;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm()


  const SingleFileChange = (e) => {
    const file = e.target.files[0]
    const fileSizeInMB = file.size / (1024 * 1024) // Convert file size to MB
    if (fileSizeInMB > 2) {
      toast.warn('File size exceeds 2MB limit.')
      e.target.value = null // Reset file input element
      return
    }
    setSingleFile(e.target.files[0])
  }

  //   form data........
  const formData = new FormData()
  formData.append('file', singleFile);
  formData.append('sellerId', sellerId);


  const [sending, setSending] = useState(false)

  const submitFile = () => {
    setSending(!sending)
    if (singleFile === '') {
      toast.warn('Please apload csv file!')
      setSending(false)
      return 0
    }
    axios
      .post('csv/card', formData)
      .then((response) => {
        toast.success(response?.data?.message)
        setSending(false)
        reset()
        setSingleFile('')
      })
      .catch((error) => {
        console.error(error)
        toast.error(error?.response?.data?.message)
        setSending(false)
      })
  }
const handleDownload = async () => {
    const response = await fetch('https://api.rarevision.net/uploads/cardCsv.csv');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-cards-csv.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-light py-5 px-5 h-[100%]">
      <form
        action=""
        className={
          ' bg-gray-100 md:px-4 px-2 py-3 min-h-[150px] shadow-md mb-2'
        }
        onSubmit={handleSubmit(submitFile)}
      >
        <h1 className="font-bold text-md text-center">Upload CSV file.</h1>
        <div className='bg-[#ffcc99] px-2 py-3'>

        <h1 className='text-lg'>Cards upload instructions!</h1>
        <p>Ensure your, columns includes the following fields  and are named as follows:</p>
        <p className='mb-2'>
             ccnum,bin,cvv,bank,type,class,level,exp,country,state,city,name,address,zip,email,phone,password,dob,ssn,dl,mmn,ip,price
        </p>
        <a className='text-light py-1 px-3  cursor-pointer hover:bg-secondary bg-green-600'  onClick={handleDownload}>Download sample </a>
        </div>
        <div className="grid  grid-cols-3 place-items-center  gap-3 my-4 ">
        
          <div className="flex flex-col gap-2 w-full ">
            <h1>CSV file </h1>
            <input
              type="file"
              accept=".csv"
              className="w-full py-1 outline-none border  bg-light focus:border-secondary"
              onChange={(event) => {
                SingleFileChange(event)
              }}
            />
          </div>
          <div>
             <div className="flex justify-center mt-6 items-center">
          {sending ? (
            <div className="flex justify-center pr-6 items-center">
              <PulseLoader color="#6ba54a" size={10} />
            </div>
          ) : (
            <button className="bg-primary text-light py-1 px-4 rounded-md hover:bg-secondary ">
              Upload
            </button>
          )}
        </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CardsCsvUpload
