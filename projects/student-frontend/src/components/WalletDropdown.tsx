import { useWallet } from "@txnlab/use-wallet-react";
import { useState } from "react";
import { ellipseAddress } from "../utils/ellipseAddress";

const WalletDropdown = () => {
  const { activeAddress, wallets } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  if (!activeAddress) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeAddress);
    setIsOpen(false);
  };

  const handleDisconnect = async () => {
    const activeWallet = wallets?.find((w) => w.isActive);
    if (activeWallet) {
      await activeWallet.disconnect();
    }
    setIsOpen(false);
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-outline border-green-600 text-green-600 rounded-full px-6 flex items-center gap-2 hover:bg-green-600 hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
        <span className="font-medium">{ellipseAddress(activeAddress)}</span>
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-white rounded-box w-52 mt-4 border border-gray-100">
        <li>
          <button onClick={handleCopy} className="flex items-center gap-2 py-3 hover:bg-green-50 text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
              />
            </svg>
            Copy Address
          </button>
        </li>
        <li>
          <button onClick={handleDisconnect} className="flex items-center gap-2 py-3 hover:bg-red-50 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            Disconnect
          </button>
        </li>
      </ul>
    </div>
  );
};

export default WalletDropdown;
