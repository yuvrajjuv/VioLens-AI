/*

*/
import Image from "next/image";
import React from "react";

interface Model500IconProps {
  width?: number;
  height?: number;
  className?: string;
}

const Model500Icon: React.FC<Model500IconProps> = ({
  width = 64,
  height = 64,
  className,
}) => {
  return (
    <Image
      src={"/model_Icons/model500.png"}
      alt="500"
      width={width}
      height={height}
      className={className}
    />
  );
};

export default Model500Icon;
