import React, { useState } from "react";
import { useWallet } from "@txnlab/use-wallet-react";
import { useSnackbar } from "notistack";
import { StudentFactory } from "../contracts/Student";
import { AlgorandClient } from "@algorandfoundation/algokit-utils";
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from "../utils/network/getAlgoClientConfigs";
import { OnSchemaBreak, OnUpdate } from "@algorandfoundation/algokit-utils/types/app";
import algosdk from "algosdk";

const StudentForm: React.FC = () => {
  const { activeAddress, transactionSigner } = useWallet();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    city: "",
    phoneNumber: "",
  });

  const algodConfig = getAlgodConfigFromViteEnvironment();
  const indexerConfig = getIndexerConfigFromViteEnvironment();
  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig,
  });
  algorand.setDefaultSigner(transactionSigner);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeAddress) {
      enqueueSnackbar("Please connect your wallet first", { variant: "error" });
      return;
    }

    if (!formData.name || !formData.rollNo || !formData.city) {
      enqueueSnackbar("Please fill in all fields", { variant: "warning" });
      return;
    }

    setLoading(true);

    try {
      const factory = new StudentFactory({
        defaultSender: activeAddress,
        algorand,
      });

      let appClient;
      const appId = import.meta.env.VITE_STUDENT_APP_ID;

      if (appId && appId !== "0" && import.meta.env.VITE_ALGOD_NETWORK === "testnet") {
        // Use existing deployed app on Testnet
        appClient = factory.getAppClientById({ appId: BigInt(appId) });
        enqueueSnackbar(`Using existing App ID: ${appId}`, { variant: "info" });
      } else {
        // Deploy or get existing app (for LocalNet or if no ID provided)
        const deployResult = await factory.deploy({
          onSchemaBreak: OnSchemaBreak.AppendApp,
          onUpdate: OnUpdate.AppendApp,
        });
        appClient = deployResult.appClient;
      }

      // Ensure app is funded for box storage (MBR)
      const appAddress = appClient.appAddress;
      const appAccountInfo = await algorand.client.algod.accountInformation(appAddress).do();

      if (appAccountInfo.amount < 150_000) {
        enqueueSnackbar("Funding contract for storage...", { variant: "info" });
        await algorand.send.payment({
          sender: activeAddress,
          receiver: appAddress,
          amount: (300_000).microAlgos(),
        });
      }

      enqueueSnackbar("Sending data to blockchain...", { variant: "info" });

      // Call add_student ABI method
      const boxKey = algosdk.decodeAddress(activeAddress).publicKey;

      const result = await appClient.send.addStudent({
        args: {
          name: formData.name,
          rollNo: formData.rollNo,
          city: formData.city,
          phoneNumber: formData.phoneNumber,
        },
        boxReferences: [{ appId: BigInt(0), name: boxKey }],
      });

      setTxId(result.txIds[0]);
      enqueueSnackbar("Student data saved successfully on blockchain!", { variant: "success" });
      setFormData({ name: "", rollNo: "", city: "", phoneNumber: "" });
    } catch (error: any) {
      console.error("Blockchain error:", error);
      enqueueSnackbar(`Failed to save data: ${error.message}`, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-50">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Student Ledger</h2>
        <div className="h-1.5 w-20 bg-green-600 mx-auto rounded-full"></div>
        <p className="mt-4 text-gray-500 font-medium">Immutable Blockchain Records</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter student name"
              className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-600 focus:bg-white outline-none transition-all font-semibold text-gray-800"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Roll ID</label>
            <input
              type="text"
              name="rollNo"
              placeholder="e.g. #STU-001"
              className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-600 focus:bg-white outline-none transition-all font-semibold text-gray-800"
              value={formData.rollNo}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Location / City</label>
          <input
            type="text"
            name="city"
            placeholder="Enter city"
            className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-600 focus:bg-white outline-none transition-all font-semibold text-gray-800"
            value={formData.city}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Enter phone number"
            className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-600 focus:bg-white outline-none transition-all font-semibold text-gray-800"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Verified Wallet</label>
          <div className="w-full px-6 py-5 rounded-2xl bg-gray-100 border-2 border-gray-100 flex items-center justify-between">
            <span className="text-gray-500 font-mono text-sm truncate max-w-[80%]">{activeAddress || "Connect wallet to register"}</span>
            {activeAddress && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5 text-green-600"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className={`w-full py-6 rounded-2xl bg-black hover:bg-green-700 text-white font-extrabold text-lg shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
              loading ? "opacity-70 cursor-wait bg-green-700" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-md"></span>
                SIGNING TRANSACTION...
              </>
            ) : (
              <>
                REGISTER ON BLOCKCHAIN
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {txId && (
        <div className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Transaction Confirmed</span>
            <a
              href={`https://lora.algokit.io/testnet/transaction/${txId}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-green-600 hover:text-green-800 transition-colors underline"
            >
              VIEW ON EXPLORER
            </a>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-green-200">
            <code className="text-sm font-mono text-green-900 truncate flex-1">{txId}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(txId);
                enqueueSnackbar("Transaction ID copied!", { variant: "success" });
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy Transaction ID"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Powered by Algorand Blockchain Technology</p>
      </div>
    </div>
  );
};

export default StudentForm;
