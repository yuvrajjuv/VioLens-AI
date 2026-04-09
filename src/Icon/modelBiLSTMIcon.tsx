/*

*/
import Image from "next/image";
import React from "react";

interface modelBiLSTMIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const modelBiLSTMIcon: React.FC<modelBiLSTMIconProps> = ({
  width = 64,
  height = 64,
  className,
}) => {
  return (
    <Image
      src={"/model_Icons/modelBiLSTM.png"} // Fixed the src path
      alt="500"
      width={width}
      height={height}
      className={className}
    />
  );
};

export default modelBiLSTMIcon;
