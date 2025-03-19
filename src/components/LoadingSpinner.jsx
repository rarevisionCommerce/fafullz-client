import { Loader } from "@mantine/core";
import React from "react";
import { SpinnerDotted } from "spinners-react";

function LoadingSpinner() {
  return (
    <div className=" p-6">
      <Loader size={60} color="yellow" />
    </div>
  );
}

export default LoadingSpinner;
