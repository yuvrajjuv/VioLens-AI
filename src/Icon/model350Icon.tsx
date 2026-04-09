import Image from "next/image";
import React from "react";

interface Model350IconProps {
  width?: number;
  height?: number;
  className?: string;
}

const Model350Icon: React.FC<Model350IconProps> = ({
  width = 24,
  height = 24,
  className,
}) => {
  return (
    <Image
      src={"/model_Icons/model350Icom.svg"}
      alt="Model 350 Icon"
      width={width}
      height={height}
      className={className}
    />
  );
};

export default Model350Icon;
