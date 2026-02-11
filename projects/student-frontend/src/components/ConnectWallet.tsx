import { useWallet, Wallet, WalletId } from "@txnlab/use-wallet-react";
import Account from "./Account";

interface ConnectWalletInterface {
  openModal: boolean;
  closeModal: () => void;
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { wallets, activeAddress } = useWallet();

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD;

  return (
    <dialog
      id="connect_wallet_modal"
      className={`modal ${openModal ? "modal-open" : ""}`}
      style={{ display: openModal ? "flex" : "none", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
      <form
        method="dialog"
        className="modal-box bg-white p-8 rounded-3xl shadow-2xl max-w-md border border-gray-100 flex flex-col relative z-[10000]"
      >
        <h3 className="font-bold text-3xl text-gray-900 mb-2">Connect Wallet</h3>
        <p className="text-gray-500 mb-6">Select your preferred wallet provider to continue</p>

        <div className="flex flex-col gap-1">
          {activeAddress && (
            <>
              <Account />
              <div className="divider" />
            </>
          )}

          {!activeAddress &&
            wallets?.map((wallet) => (
              <button
                data-test-id={`${wallet.id}-connect`}
                className="btn btn-outline border-gray-200 hover:border-green-600 hover:bg-green-50 m-2 flex items-center justify-start gap-4 h-16 px-6 rounded-xl transition-all"
                key={`provider-${wallet.id}`}
                onClick={() => {
                  return wallet.connect();
                }}
              >
                {!isKmd(wallet) && (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img alt={`wallet_icon_${wallet.id}`} src={wallet.metadata.icon} className="w-full h-full object-contain" />
                  </div>
                )}
                {isKmd(wallet) && (
                  <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-green-600"
                      width="20"
                      height="20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 9 0v8.25"
                      />
                    </svg>
                  </div>
                )}
                <span className="font-semibold text-black">{isKmd(wallet) ? "LocalNet Wallet" : wallet.metadata.name}</span>
              </button>
            ))}
        </div>

        <div className="modal-action mt-8 flex justify-end gap-2">
          <button
            data-test-id="close-wallet-modal"
            className="btn btn-ghost rounded-full px-8 text-gray-400 hover:text-gray-600"
            onClick={() => {
              closeModal();
            }}
          >
            Cancel
          </button>
          {activeAddress && (
            <button
              className="btn btn-outline rounded-full px-8 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              data-test-id="logout"
              onClick={async () => {
                if (wallets) {
                  const activeWallet = wallets.find((w) => w.isActive);
                  if (activeWallet) {
                    await activeWallet.disconnect();
                  } else {
                    // Required for logout/cleanup of inactive providers
                    // For instance, when you login to localnet wallet and switch network
                    // to testnet/mainnet or vice verse.
                    localStorage.removeItem("@txnlab/use-wallet:v3");
                    window.location.reload();
                  }
                }
              }}
            >
              Logout
            </button>
          )}
        </div>
      </form>
    </dialog>
  );
};
export default ConnectWallet;
