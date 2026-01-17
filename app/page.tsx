import Access from "./components/Access";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Methodology from "./components/Methodology";
import Navbar from "./components/Navbar";
import TrustedBy from "./components/TrustedBy";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <TrustedBy />
        <Methodology />
        <Access />
      </main>
      <Footer />
    </>
  );
}