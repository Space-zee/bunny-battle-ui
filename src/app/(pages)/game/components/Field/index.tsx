import s from "./style.module.scss";
import { Grid } from "@radix-ui/themes";
import { Cell } from "./Cell";
import { IGame } from "@/app/(pages)/game/models";

type FieldProps = {
  game: IGame;
  onChangeGame: (game: IGame) => void;
};

export const Field = ({ onChangeGame, game }: FieldProps) => {
  const cells = Array(9).fill(null);

  return (
    <Grid columns="3" gap="2" rows="3" width="auto" className={s.root}>
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
