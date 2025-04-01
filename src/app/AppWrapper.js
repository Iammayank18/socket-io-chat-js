import GlobalContextProvider from "../context/GlobalContextProvider";

export default function AppWrappers({ children }) {
  return <GlobalContextProvider>{children}</GlobalContextProvider>;
}
