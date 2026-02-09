import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
// import ssnSample from '../../assets/Downloads/sample-ssncsv.csv';

function SsnCsvUpload() {
  const { auth } = useAuth();
  const [singleFile, setSingleFile] = useState("");
  const sellerId = auth?.jabberId;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm();

  //get all bases
  const getBases = () => {
    return axios.get(`/bases`);
  };

  const { isLoading: loadingBases, data: basesData } = useQuery(
    ["bases-"],
    getBases,
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  );
  // making base optopns
  const baseOptions = [];

  basesData?.data?.bases?.map((base, index) => {
    baseOptions.push({
      label: base.base,
      value: base._id,
    });
  });
  //end...........

  const SingleFileChange = (e) => {
    const file = e.target.files[0];
    const fileSizeInMB = file.size / (1024 * 1024); // Convert file size to MB
    if (fileSizeInMB > 2) {
      toast.warn("File size exceeds 2MB limit.");
      e.target.value = null; // Reset file input element
      return;
    }
    setSingleFile(e.target.files[0]);
  };
  console.log(singleFile);

  const base = watch("base");

  //   form data........
  const formData = new FormData();
  formData.append("file", singleFile);
  formData.append("base", base?.label);
  formData.append("price", base?.value);
  formData.append("sellerId", sellerId);

  const [sending, setSending] = useState(false);

  const submitFile = () => {
    setSending(!sending);
    if (singleFile === "") {
      toast.warn("Please apload csv file!");
      setSending(false);
      return 0;
    }
    axios
      .post("csv/ssn", formData)
      .then((response) => {
        toast.success(response?.data?.message);
        setSending(false);
        reset();
        setSingleFile("");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error?.response?.data?.message);
        setSending(false);
      });
  };
  const handleDownload = async () => {
    const response = await fetch("https://api.fafullz.org/uploads/ssnCsv.csv");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-ssncsv.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-[#0b1220] py-5 px-5 min-h-screen text-gray-200">
      <form
        action=""
        className="bg-[#111827] md:px-4 px-2 py-3 min-h-[150px] shadow-lg rounded mb-2 border border-gray-800"
        onSubmit={handleSubmit(submitFile)}
      >
        <h1 className="font-bold text-md text-center text-gray-100">
          Upload CSV file.
        </h1>

        <div className="bg-[#1f2937] border border-yellow-600/40 px-2 py-3 rounded mt-3">
          <h1 className="text-lg text-yellow-400">Upload instructions!</h1>

          <p className="text-gray-300">
            Ensure your columns include the following fields and are named as
            follows:
          </p>

          <p className="mb-2 text-gray-100 font-mono">
            firstName,lastName,country,state,zip,dob,address,ssn,cs,city,description
          </p>

          <a
            className="inline-block text-white py-1 px-3 cursor-pointer rounded bg-green-600 hover:bg-green-700 transition"
            onClick={handleDownload}
          >
            Download sample
          </a>
        </div>

        <div className="grid grid-cols-3 place-items-center gap-3 my-4">
          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-gray-200 text-sm">Base</h1>

            <Controller
              name="base"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  id=""
                  options={baseOptions}
                  value={baseOptions?.find(
                    (option) => option.value === field.value,
                  )}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                      ...theme.colors,
                      neutral0: "#111827",
                      neutral80: "#e5e7eb",
                      neutral20: "#374151",
                      primary25: "#1f2937",
                      primary: "#6ba54a",
                    },
                  })}
                />
              )}
            />

            <p className="text-red-400 text-xs">
              {errors.base?.type === "required" && "Base is required"}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-gray-200 text-sm">CSV file</h1>

            <input
              type="file"
              accept=".csv"
              className="w-full py-1 px-2 outline-none border border-gray-700 bg-[#111827] text-white rounded focus:border-secondary focus:ring-1 focus:ring-secondary transition"
              onChange={(event) => {
                SingleFileChange(event);
              }}
            />
          </div>

          <div>
            <div className="flex justify-center my-6 items-center">
              {sending ? (
                <div className="flex justify-center pr-6 items-center">
                  <PulseLoader color="#6ba54a" size={10} />
                </div>
              ) : (
                <button className="bg-primary text-white py-1 px-4 rounded-md hover:bg-secondary transition">
                  Upload
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SsnCsvUpload;
