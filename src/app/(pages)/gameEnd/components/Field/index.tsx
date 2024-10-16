import { Grid, Box } from "@radix-ui/themes";
import { Cell } from "./Cell";
import { IGameResultStepForField } from "@/app/(pages)/gameEnd/types";
import s from "./style.module.scss";
import clsx from "clsx";

type FieldProps = {
  steps: IGameResultStepForField[];
  username: string;
  opponentBoard: boolean;
};

export const Field = ({ steps, username, opponentBoard }: FieldProps) => {
  const cells = Array(9).fill(null);
  return (
    <Box className={s.root}>
      <Box className={clsx(s.userName, opponentBoard && s.opponent)}>
        {username}
      </Box>
      <Grid columns="3" rows="3" className={s.field}>
        {cells.map((el, index) => (
          <Cell
            key={index}
            index={index}
            steps={steps}
            opponentBoard={opponentBoard}
          />
        ))}
      </Grid>
    </Box>
  );
};
