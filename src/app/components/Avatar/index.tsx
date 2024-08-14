import clsx from "clsx";
import s from "./style.module.scss";
import { Flex } from "@radix-ui/themes";
import Image from "next/image";

type AvatarProps = {
  photo: string;
  width: number;
  height: number;
  className?: string;
  isActive?: boolean;
};

export const Avatar = ({
  isActive,
  photo,
  height,
  width,
  className,
}: AvatarProps) => {
  return (
    <Flex
      className={clsx(s.root, className, isActive && s.active)}
      style={{ width: `${width}px`, height: `${height}px` }}
      align="center"
      justify="center"
    >
      <Image
        className={s.photo}
        src={photo}
        alt={"photo"}
        width={width - width * 0.15}
        height={height - height * 0.15}
      />
    </Flex>
  );
};
