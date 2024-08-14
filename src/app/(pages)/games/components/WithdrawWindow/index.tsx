import s from "./style.module.scss";
import { Text, Flex, Box } from "@radix-ui/themes";
import Image from "next/image";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { Input } from "@/app/components";
import { formatBalance, TgButtons } from "@/app/shared/utils";
import { colors } from "@/app/shared/constants";

type WithdrawWindowProps = {
  balance: string;
  TgButtons: TgButtons;
  onWithdraw: (amount: string, to: string) => Promise<boolean>;
  onClose: () => void;
};

export const WithdrawWindow = ({
  balance,
  onClose,
  onWithdraw,
  TgButtons,
}: WithdrawWindowProps) => {
  const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [toAddressError, setToAddressError] = useState("");

  const onChangeAmount = (event: any) => {
    const value = event.target.value;
    validateAmount(value);
  };

  const onChangeToAddress = (event: any) => {
    const value = event.target.value;
    isValidEthAddress(value);
  };

  const validateAmount = (value: string) => {
    if (/^-?\d*\.?\d*$/.test(value)) {
      if (Number(value) > Number(balance) || Number(value) < 0) {
        setAmount(value);
        setAmountError("Not enough balance");
      } else {
        setAmount(value);
        setAmountError("");
      }
    } else {
      setAmountError("Invalid number");
    }
  };

  const isValidEthAddress = (address: string) => {
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setToAddress(address);
      setToAddressError("");
    } else {
      setToAddress(address);
      setToAddressError("Invalid ethereum address");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose && onClose();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClose]);

  const onWithdrawLocal = async () => {
    TgButtons.mainButton.showProgress();
    await onWithdraw(Number(amount).toFixed(5), toAddress);
    TgButtons.mainButton.hideProgress();
  };

  useEffect(() => {
    TgButtons.showMainButton(onWithdrawLocal, {
      color: colors.pink400,
      text_color: colors.black,
      text: "Confirm",
      is_active:
        !!amount &&
        Number(amount) > 0 &&
        Number(amount) <= Number(balance) &&
        /^0x[a-fA-F0-9]{40}$/.test(toAddress),
    });
  }, [amount, toAddress]);

  return (
    <Flex
      className={s.root}
      direction="column"
      align="center"
      justify="center"
      ref={ref}
    >
      <Flex className={s.headerWrapper} justify="between">
        <Text className={s.header}>Withdraw ETH</Text>
        <Image
          onClick={onClose}
          src={"/close.svg"}
          alt={"close"}
          width={24}
          height={24}
          className={s.closeIcon}
        />
      </Flex>

      <Flex className={s.inputWrapper} direction="column">
        <Flex justify="between" className={s.inputHeader}>
          <Text className={s.selectAmount}>Select Amount</Text>
          <Flex>
            <Text className={s.balance}>
              {formatBalance(Number(balance))} ETH
            </Text>
            <Box className={s.maxButton} onClick={() => setAmount(balance)}>
              Max
            </Box>
          </Flex>
        </Flex>
        <Input
          className={s.input}
          onChange={onChangeAmount}
          placeholder={"0.001 ETH"}
          value={amount}
          error={amountError}
        />
        <Flex justify="between" className={s.inputHeader}>
          <Text className={s.selectAmount}>Select To Address</Text>
        </Flex>
        <Input
          className={s.input}
          onChange={onChangeToAddress}
          placeholder={"To"}
          value={toAddress}
          error={toAddressError}
        />
      </Flex>
    </Flex>
  );
};
