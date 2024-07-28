"use client";
import s from "./style.module.scss";
import { Grid } from "@radix-ui/themes";
import { Cell } from "./Cell";
import { CellStatusEnum } from "@/app/shared/enums";

type FieldProps = {};

export const Field = ({}: FieldProps) => {
  const cells = Array(9).fill(null);

  return (
    <Grid columns="3" gap="2" rows="3" width="auto" className={s.root}>
      {cells.map((el, index) => (
        <Cell key={index} id={index + 1} status={CellStatusEnum.OpponentShot} />
      ))}
    </Grid>
  );
};
