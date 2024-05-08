import { useContractWrite, useWalletClient } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { parseEther } from "viem";

import Tokenabi from "../../../../newtokenabi.json";
import { useState } from "react";

interface TradingForm {
  liq: number;
  lockPeriod: number;
  shouldBurn: boolean;
}

const StartTrading = ({
  contractAddress,
}: {
  contractAddress: `0x${string}`;
}) => {
  const { data: walletClient } = useWalletClient();
  const [showLock, setShowLock] = useState(true);

  // contract call to start trading of the launched token.
  const { data, isSuccess, write } = useContractWrite({
    address: contractAddress,
    abi: Tokenabi.abi,
    functionName: "startTrading",
    account: walletClient?.account,
    onSuccess(res) {
      console.log(res);
    },
    onError(error) {
      console.log(error);
    },
  });

  // handle form & fire launch token with the form details
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TradingForm>();
  const onSubmit: SubmitHandler<TradingForm> = (formData) => {
    console.log(formData.lockPeriod);
    write({
      args: [formData.lockPeriod, formData.shouldBurn],
      value: parseEther("1"),
    });
  };
  return (
    <>
      <h2 className="block text-2xl my-4 font-thin">
        Get your token to the moon!
      </h2>
      <div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900 mb-2">
        <label className="block text-sm leading-6 text-gray-400">
          Start Trading
        </label>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex justify-between">
            <input
              type="text"
              id="liq"
              defaultValue="0.01"
              placeholder="Liquid ETH"
              className="block w-32 rounded-xl ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl border-x border-gray-400"
              {...register("liq", {
                required: true,
                min: 0,
              })}
            />
            <div className="rounded-3xl flex items-center">
              <span className="text-xl text-gray-400 px-4">Should Burn</span>
              <input
                type="checkbox"
                id="burn"
                {...register("shouldBurn")}
                onChange={() => {
                  setShowLock((showLock) => !showLock);
                }}
                defaultChecked={false}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            {showLock && (
              <div className="rounded-3xl flex items-center">
                <span className="text-xl text-gray-400 pr-4">Lock days</span>
                <input
                  type="number"
                  id="days"
                  {...register("lockPeriod", {
                    required: true,
                    min: 30,
                  })}
                  placeholder="30"
                  defaultValue="30"
                  className="block w-20 rounded-xl ps-2 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl border-x border-gray-400"
                />
              </div>
            )}
            <div className="flex justify-center flex-col">
              <input
                type="submit"
                value="Start"
                className="safu-button-primary cursor-pointer"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default StartTrading;
