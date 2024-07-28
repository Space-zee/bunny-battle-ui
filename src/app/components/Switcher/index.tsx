import s from "./styles.module.scss";
import clsx from "clsx";

interface Tab {
  id: string;
  label: string;
}

type SwitcherProps = {
  activeTab: string;
  onSetActiveTab: (tab: any) => void;
  tabs: Tab[];
  className?: string;
  activeBackGroundColor?: string;
};

export const Switcher = ({
  tabs,
  onSetActiveTab,
  activeTab,
  className,
  activeBackGroundColor,
}: SwitcherProps) => {
  return (
    <div className={clsx(s.switcher, className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={clsx(s.tab, activeTab === tab.id && s.active)}
          onClick={() => onSetActiveTab(tab.id)}
          style={{
            background: activeTab === tab.id ? activeBackGroundColor : "none",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
