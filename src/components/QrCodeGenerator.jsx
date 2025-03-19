import React, { useState } from "react";
import QRCode from "qrcode.react";
import btcIcon from "../assets/graphics/btc.png";
import solIcon from "../assets/graphics/sol.svg";
import liteIcon from "../assets/graphics/lite.png";
import usdtIcon from "../assets/graphics/usdc.png";
import { Alert } from "@mantine/core";

function QrCodeGenerator({ data }) {
  //copy to clipboard
  const [copyText, setCopyText] = useState("Copy");
  const handleCopy = () => {
    navigator.clipboard.writeText(data?.pay_address);
    setCopyText("✔ Copied");
    setTimeout(() => {
      setCopyText("Copy");
    }, 2000);
  };
  // copy amount
  const [copyAmount, setCopyAmount] = useState("Copy");
  const handleCopyAmount = () => {
    navigator.clipboard.writeText(data?.pay_amount);
    setCopyAmount("✔ Copied");
    setTimeout(() => {
      setCopyAmount("Copy");
    }, 2000);
  };
  const iconObj = {
    btc: btcIcon,
    usdterc20: usdtIcon,
    ltc: liteIcon,
    sol: solIcon,
  };

  const currencyname = (name) => {
    if (name === "ltc") {
      return "litecoin";
    } else if (name === "btc") {
      return "bitcoin";
    } else if (name === "sol") {
      return "Solana";
    } else if (name === "usdterc20") {
      return 'tether'
    } else {
      return "name";
    }
  };

  const coinURI = `${currencyname(data?.pay_currency)}:${
    data?.pay_address
  }?amount=${data?.pay_amount}`;
  const qrCodeSize = 200;
  const iconSize = 40;

  // Style for the icon image overlay
  const iconStyle = {
    position: "absolute",
    top: `calc(50% - ${iconSize / 2}px)`,
    left: `calc(50% - ${iconSize / 2}px)`,
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    borderRadius: "50%",
    backgroundColor: "white",
    zIndex: 100,
  };

  return (
    <div className={!data ? `hidden` : ""}>
      <div className="flex flex-col   justify-center items-center">
        <Alert
          title={"Note"}
          color="green"
          radius="xs"
          className={data?.pay_currency === 'usdterc20' ? "" : "hidden"}
        >
          Only send USDT to this address from ERC20. Don't send USDT from other
          networks or it will result in a loss of funds.
        </Alert>
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginTop: 10,
          }}
        >
          <QRCode size={qrCodeSize} value={coinURI} />
          <img src={iconObj[data?.pay_currency]} alt="Icon" style={iconStyle} />
        </div>
      </div>

      <div className="w-full  ">
        <h1 className="font-bold ">{data?.pay_currency} Address</h1>

        <div className=" py-2 px-1  flex flex-wrap justify-between w-full">
          <h1>{data?.pay_address}</h1>
          <h1
            className="text-light  cursor-pointer  px-2 rounded-sm  "
            onClick={handleCopy}
          >
            {copyText}
          </h1>
        </div>
        <h1 className="font-bold ">Amount</h1>

        <div className=" py-2 px-1  flex flex-wrap justify-between w-full">
          <h1>
            {data?.pay_amount} {data?.pay_currency}
          </h1>
          <h1
            className="text-light  cursor-pointer  px-2 rounded-sm  "
            onClick={handleCopyAmount}
          >
            {copyAmount}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default QrCodeGenerator;
