import s from "./style.module.scss";
import { IUserData } from "@/app/shared/types";
import Image from "next/image";
import { Flex, Text } from "@radix-ui/themes";
import { formatAddress } from "@/app/shared/utils";
import copy from "copy-text-to-clipboard";
import "@radix-ui/themes/styles.css";
import { motion } from "framer-motion";

type WalletItemProps = {
  userData: IUserData;
};

const WalletItem = ({ userData }: WalletItemProps) => {
  return (
    <motion.div whileTap={{ scale: 0.9 }} onClick={() => copy(userData.wallet)}>
      <Flex className={s.walletWrapper}>
        <Image
          className={s.copyIcon}
          src={"/copy.svg"}
          alt={"copy"}
          width={16}
          height={16}
        />

        <Text className={s.whiteText}>{formatAddress(userData.wallet)} </Text>
      </Flex>
    </motion.div>
  );
};

export default WalletItem;
