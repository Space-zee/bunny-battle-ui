"use client";

import clsx from "clsx";
import s from "./style.module.scss";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@radix-ui/themes";

type InputProps = {
  onChange: (e: any) => void;
  setFocus?: (e: any) => void;
  placeholder: string;
  error?: string;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  focus?: boolean;
  maxLength?: number;
  id?: string;
  value?: any;
};

export const Input = ({
  className,
  onChange,
  setFocus,
  placeholder,
  error,
  children,
  disabled,
  focus,
  maxLength,
  id,
  value,
}: InputProps) => {
  const ref: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (setFocus) {
      setFocus(isInputFocused);
    }
  }, [isInputFocused]);
  useEffect(() => {
    if (focus && ref && ref.current) {
      ref.current.focus();
    }
  }, []);
  return (
    <Box className={className}>
      <Flex
        justify="between"
        align="center"
        className={clsx(
          s.inputWrapper,
          !disabled && isInputFocused && s.inputWrapperFocus,
          error && s.error,
        )}
      >
        <input
          id={id || new Date().getTime().toString()}
          ref={ref}
          disabled={disabled}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={s.input}
          value={value}
        />
        {children}
      </Flex>
      {error && (
        <Text size="1" className={s.validation}>
          {error}
        </Text>
      )}
    </Box>
  );
};
