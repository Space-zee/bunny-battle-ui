import s from "./style.module.scss";
import { Box } from "@radix-ui/themes";
import clsx from "clsx";

type UsernameBoxProps = {
  isUser: boolean;
  isActive: boolean;
  username: string;
};

export const UsernameBox = ({
  username,
  isActive,
  isUser,
}: UsernameBoxProps) => {
  return isUser ? (
    <Box className={clsx(s.root, s.userRoot, isActive && s.active)}>
      @{username}
    </Box>
  ) : (
    <Box className={clsx(s.root, s.opponentRoot, isActive && s.active)}>
      @{username}
    </Box>
  );
};
