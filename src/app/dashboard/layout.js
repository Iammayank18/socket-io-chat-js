import Script from "next/script";
import Sidebar from "../../component/Sidebar";

export default function RootLayout({ children }) {
  return (
    <>
      <Sidebar>{children}</Sidebar>
      <Script src="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"></Script>
    </>
  );
}
