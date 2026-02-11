import { useWallet } from "@txnlab/use-wallet-react";
import React from "react";
import ConnectWallet from "./ConnectWallet";
import WalletDropdown from "./WalletDropdown";

interface NavBarProps {
  openWalletModal: boolean;
  toggleWalletModal: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ openWalletModal, toggleWalletModal }) => {
  const { activeAddress } = useWallet();

  return (
    <div className="navbar bg-white px-4 py-4 border-b border-gray-100 flex justify-between items-center fixed top-0 w-full z-[1001] shadow-sm">
      <div className="flex-1">
        <a className="text-3xl font-bold text-green-600 cursor-pointer ml-4">Consalting</a>
      </div>

      <div className="hidden lg:flex flex-none gap-8 mr-8">
        <a className="text-black font-medium hover:text-green-600 cursor-pointer transition-colors">About us</a>
        <div className="dropdown dropdown-hover">
          <label
            tabIndex={0}
            className="text-black font-medium hover:text-green-600 cursor-pointer flex items-center gap-1 transition-colors"
          >
            Services
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
              width="16"
              height="16"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </label>
        </div>
        <div className="dropdown dropdown-hover">
          <label
            tabIndex={0}
            className="text-black font-medium hover:text-green-600 cursor-pointer flex items-center gap-1 transition-colors"
          >
            Cases
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
              width="16"
              height="16"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </label>
        </div>
        <a className="text-black font-medium hover:text-green-600 cursor-pointer transition-colors">Reviews</a>
        <a className="text-black font-medium hover:text-green-600 cursor-pointer transition-colors">Blog</a>
        <a className="text-black font-medium hover:text-green-600 cursor-pointer transition-colors">Contacts</a>
      </div>

      <div className="flex-none gap-4">
        {activeAddress ? (
          <WalletDropdown />
        ) : (
          <button
            className="btn bg-green-600 hover:bg-green-700 text-white border-none rounded-full px-10 font-bold transition-all shadow-md active:scale-95 mr-4"
            onClick={toggleWalletModal}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
