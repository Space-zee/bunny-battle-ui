import s from "./style.module.scss";
import { Grid } from "@radix-ui/themes";
import { Cell } from "./Cell";
import clsx from "clsx";
import { IGame } from "@/app/shared/types";

type FieldProps = {
  game: IGame;
  onChangeGame: (game: IGame) => void;
};

export const Field = ({ onChangeGame, game }: FieldProps) => {
  const cells = Array(9).fill(null);
  return (
    <Grid
      columns="3"
      gap="2"
      rows="3"
      className={clsx(s.root, game.isDisableField && s.disabled)}
    >
      {cells.map((el, index) => (
        <Cell
          key={index}
          index={index}
          game={game}
          onChangeGame={onChangeGame}
        />
      ))}
    </Grid>
  );
};
