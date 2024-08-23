"use client";

import * as React from "react";
import { MutableRefObject, useEffect, useRef } from "react";
import * as Toast from "@radix-ui/react-toast";
import s from "./styles.module.scss";
import clsx from "clsx";
import { Flex, Text } from "@radix-ui/themes";
import { Avatar } from "@/app/components";

type NotificationProps = {
  isOpen: boolean;
  onOpen: (value: boolean) => void;
  onClickOutside: () => void;
  text: string;
  image?: string;
  type?: "joined" | "left";
  bottom?: string;
};

export const NotificationSecond = ({
  isOpen,
  onOpen,
  text,
  onClickOutside,
  image,
  type,
  bottom,
}: NotificationProps) => {
  const ref: MutableRefObject<HTMLLIElement | null> = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);
  console.log(bottom);

  return (
    <Toast.Provider swipeDirection="down" duration={2000}>
      <Toast.Viewport className={s.toastViewport} />
      <Toast.Root
        ref={ref}
        className={s.toastRoot}
        open={isOpen}
        onOpenChange={onOpen}
        style={{ bottom: bottom ? `${bottom}px` : 0 }}
      >
        <Toast.Title className={clsx(s.toastTitleWrapper)}>
          <Flex align="center" justify="center">
            {image && (
              <Avatar isActive={false} photo={image} width={20} height={20} />
            )}
            <Text className={clsx(s.notificationTitleText)}>
              <span className={s.text}>{text}</span>{" "}
              <span
                className={clsx(
                  s.type,
                  type === "joined" && s.joined,
                  type === "left" && s.left,
                )}
              >
                {type ? type : ""}
              </span>
            </Text>
          </Flex>
        </Toast.Title>
      </Toast.Root>
      <Toast.Viewport className={s.toastViewport} />
    </Toast.Provider>
  );
};
