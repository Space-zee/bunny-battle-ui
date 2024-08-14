"use client";

import * as React from "react";
import { MutableRefObject, useEffect, useRef } from "react";
import * as Toast from "@radix-ui/react-toast";
import s from "./styles.module.scss";
import Image from "next/image";
import clsx from "clsx";
import { Flex, Text } from "@radix-ui/themes";
import { NotificationTitleIcon } from "@/app/shared/enums";
import { CopyIcon } from "@/app/components/icons/CopyIcon";
import { colors } from "@/app/shared/constants";
import { WebApp } from "@twa-dev/types";

type NotificationProps = {
  isOpen: boolean;
  onOpen: (value: boolean) => void;
  onClickOutside: () => void;
  title: string;
  titleIcon: NotificationTitleIcon;
  description?: {
    text?: string;
    link?: string;
    color?: string;
  };
  bottom?: number;
  WebApp: WebApp | null;
};

export const Notification = ({
  isOpen,
  onOpen,
  title,
  description,
  titleIcon,
  onClickOutside,
  bottom,
  WebApp,
}: NotificationProps) => {
  const ref: MutableRefObject<HTMLLIElement | null> = useRef(null);

  useEffect(() => {
    if (titleIcon !== "/copy.svg") {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <Toast.Provider swipeDirection="down" duration={5000}>
      <Toast.Viewport className={s.toastViewport} />
      <Toast.Root
        ref={ref}
        className={s.toastRoot}
        open={isOpen}
        onOpenChange={onOpen}
        style={{ bottom: bottom ? bottom : 0 }}
      >
        <Toast.Title className={clsx(s.toastTitleWrapper)}>
          <Flex align="center" justify="center">
            {titleIcon === NotificationTitleIcon.Copy ? (
              <CopyIcon
                width={20}
                height={20}
                className={s.copyIcon}
                color={colors.pink400}
              />
            ) : (
              <Image
                src={titleIcon}
                alt={"statusIcon"}
                width={20}
                height={20}
              />
            )}
            <Text className={clsx(s.notificationTitleText)} size="2" ml="2">
              {title}
            </Text>
          </Flex>
          <Toast.Action className={s.action} asChild altText="Close notif">
            <Image src={"/close.svg"} alt={"close"} width={20} height={20} />
          </Toast.Action>
        </Toast.Title>
        {description && (
          <Toast.Description asChild>
            <Text
              style={{ color: description.color }}
              className={s.description}
              size="2"
            >
              {description.link ? (
                <Text
                  onClick={() => WebApp?.openLink(description?.link as string)}
                >
                  {description.text}
                </Text>
              ) : (
                description.text
              )}
            </Text>
          </Toast.Description>
        )}
      </Toast.Root>
      <Toast.Viewport className={s.toastViewport} />
    </Toast.Provider>
  );
};
