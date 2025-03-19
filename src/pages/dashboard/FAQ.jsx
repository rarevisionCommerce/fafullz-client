import React, { useState } from "react";
import { BiPlus, BiMinus } from "react-icons/bi";

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
 

  return (
    <div className="mb-6 min-w-full">

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between min-w-full items-center py-[12px] pr-[24px] pl-[40px] bg-[#F3F3F3]  hover:border-l-4 border-primary "      >
        <p className=" font-medium">{question}</p>
        {isOpen ? (
          <BiMinus className="w-6 h-6 text-dark rounded-full bg-primary" />
        ) : (
          <BiPlus className="w-6 h-6 text-dark rounded-full bg-primary" />
        )}
      </button>
      {isOpen && (
        <div className="ease-in-out duration-500 min-w-full p-4 b py-[24px] px-[40px]">
          <p className="text-sm ">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQ;