// src/components/Home.tsx
import { useWallet } from "@txnlab/use-wallet-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConnectWallet from "./components/ConnectWallet";
import Transact from "./components/Transact";
import AppCalls from "./components/AppCalls";
import NavBar from "./components/NavBar";
import StudentForm from "./components/StudentForm";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false);
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false);
  const { activeAddress } = useWallet();
  const navigate = useNavigate();

  // Redirect to login if wallet is disconnected
  useEffect(() => {
    if (!activeAddress) {
      navigate("/");
    }
  }, [activeAddress, navigate]);

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal);
  };

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal);
  };

  const toggleAppCallsModal = () => {
    setAppCallsDemoModal(!appCallsDemoModal);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <NavBar openWalletModal={openWalletModal} toggleWalletModal={toggleWalletModal} />

      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />

      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden bg-white pt-24">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-0 w-full h-full bg-green-300 rounded-full blur-[120px]"></div>
          <div className="absolute -top-20 right-0 w-2/3 h-2/3 bg-green-200 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black mb-8 leading-tight">
              Technology, support, growth
              <span className="text-green-600">— all in one window</span>
            </h1>

            <p className="text-xl md:text-1xl text-gray-600 mb-12 max-w-2xl leading-relaxed font-medium">
              We help businesses receive grants, create products, and enter the market. Our blockchain solutions provide the transparency
              and efficiency you need.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="btn btn-primary btn-lg rounded-full bg-green-600 border-none hover:bg-green-700 px-12 h-16 flex items-center gap-2 text-white shadow-xl transition-all active:scale-95"
                onClick={() => setAppCallsDemoModal(true)}
              >
                Get a consultation
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                  width="24"
                  height="24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Form Section */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <StudentForm />
        </div>
      </div>

      {/* Keep the demos but hide them until triggered or move them below the hero */}
      <div className="container mx-auto px-6 py-8 flex flex-wrap justify-center gap-4">
        {activeAddress && (
          <button data-test-id="transactions-demo" className="btn btn-ghost border-gray-200 rounded-full px-8" onClick={toggleDemoModal}>
            Transactions Demo
          </button>
        )}
      </div>

      <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
      <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} />
    </div>
  );
};

export default Home;
