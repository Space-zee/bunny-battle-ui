import s from "./style.module.scss";
import { IUserWallet } from "@/app/shared/types";
import Image from "next/image";
import { Flex, Text, Box } from "@radix-ui/themes";
import { formatAddress } from "@/app/shared/utils";
import copy from "copy-text-to-clipboard";
import "@radix-ui/themes/styles.css";
import { motion } from "framer-motion";

type WalletItemProps = {
  wallet: IUserWallet;
};

const WalletItem = ({ wallet }: WalletItemProps) => {
  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Flex className={s.walletWrapper}>
        <Image
          className={s.copyIcon}
          src={"/copy.svg"}
          alt={"copy"}
          width={16}
          height={16}
          onClick={() => copy(wallet.wallet)}
        />

        <Text className={s.whiteText}>{formatAddress(wallet.wallet)} </Text>
      </Flex>
    </motion.div>
  );
};

export default WalletItem;
