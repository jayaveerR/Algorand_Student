// src/Login.tsx
import { useWallet } from "@txnlab/use-wallet-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConnectWallet from "./components/ConnectWallet";

const Login: React.FC = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);
  const { activeAddress } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeAddress) {
      navigate("/home");
    }
  }, [activeAddress, navigate]);

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-0 w-full h-full bg-green-300 rounded-full blur-[120px]"></div>
        <div className="absolute -top-20 right-0 w-2/3 h-2/3 bg-green-200 rounded-full blur-[100px]"></div>
      </div>

      <div className="z-10 text-center px-6">
        <h1 className="text-5xl font-bold text-green-600 mb-4">Consalting</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 leading-tight">Welcome to our Platform</h2>
        <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto">
          Please connect your wallet to access the dashboard and student management system.
        </p>

        <button
          className="btn bg-green-600 hover:bg-green-700 text-white border-none rounded-full px-12 h-16 font-bold text-lg transition-all shadow-xl active:scale-95"
          onClick={toggleWalletModal}
        >
          Connect Wallet to Start
        </button>
      </div>

      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />

      <div className="absolute bottom-10 text-gray-400 text-sm">© 2026 Consalting. All rights reserved.</div>
    </div>
  );
};

export default Login;
