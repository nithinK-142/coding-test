import { createContext, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

export interface IPathContext {
  pathName: string;
  pathnames: string[];
  getRouteTo: (index: number) => string;
}

const defaultVal: IPathContext = {
  pathName: "",
  pathnames: [],
  getRouteTo: () => "",
};

export const PathContext = createContext<IPathContext>(defaultVal);

export const PathContextProvider = (props: { children: React.ReactNode }) => {
  const [pathName, setPathName] = useState<string>("");
  const { pathname } = useLocation();

  useEffect(() => {
    setPathName(pathname);
  }, [pathname]);

  const pathnames = useMemo(() => {
    return pathname.split("/").filter((x) => x);
  }, [pathname]);

  const getRouteTo = (index: number) => {
    return `/${pathnames.slice(0, index + 1).join("/")}`;
  };

  const contextValue: IPathContext = {
    pathName,
    pathnames,
    getRouteTo,
  };

  return (
    <PathContext.Provider value={contextValue}>
      {props.children}
    </PathContext.Provider>
  );
};
