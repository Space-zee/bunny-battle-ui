import s from "./style.module.scss";
import clsx from "clsx";

export const Loader = ({
  className,
  withoutWrapper,
}: {
  className?: string;
  withoutWrapper?: boolean;
}) => {
  return withoutWrapper ? (
    <div className={clsx(s.loader, className)} />
  ) : (
    <div className={s.loaderWrapper}>
      <div className={clsx(s.loader, className)} />
    </div>
  );
};
