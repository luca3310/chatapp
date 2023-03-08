import "@/styles/globals.css";
import Navbar from "@/Components/Navbar";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
