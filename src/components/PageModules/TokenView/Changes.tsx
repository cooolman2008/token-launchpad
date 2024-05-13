import { useContractWrite, useWalletClient } from "wagmi";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { parseEther } from "viem";

import Tokenabi from "../../../../newtokenabi.json";
import Ownerabi from "../../../../ownerabi.json";

interface LockForm {
  ldays: number;
}

const Changes = ({
  contractAddress,
  isLimited,
  isLpBurnt,
  isLpRetrieved,
}: {
  contractAddress: `0x${string}`;
  isLimited: boolean;
  isLpBurnt: boolean;
  isLpRetrieved: boolean;
}) => {
  const { data: walletClient } = useWalletClient();
  const [lpBurnt, setLpBurnt] = useState(isLpBurnt);

  // contract call to start trading of the launched token.
  const { data, isSuccess, write } = useContractWrite({
    address: contractAddress,
    abi: Ownerabi.abi,
    functionName: "extendLock",
    account: walletClient?.account,
    onSuccess(res) {
      console.log(res);
    },
    onError(error) {
      console.log(error);
    },
  });

  // contract call to remove Limits of the launched token.
  const { isSuccess: removed, write: remove } = useContractWrite({
    address: contractAddress,
    abi: Tokenabi.abi,
    functionName: "removeLimits",
    account: walletClient?.account,
    onSuccess(res) {
      isLimited = false;
      console.log(res);
    },
    onError(error) {
      console.log(error);
    },
  });

  // contract call to remove Limits of the launched token.
  const { isSuccess: isBurnt, write: burn } = useContractWrite({
    address: contractAddress,
    abi: Ownerabi.abi,
    functionName: "burnLP",
    account: walletClient?.account,
    onSuccess(res) {
      setLpBurnt(true);
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
  } = useForm<LockForm>();
  const onSubmit: SubmitHandler<LockForm> = (formData) => {
    write({
      args: [formData.ldays],
    });
  };
  return (
    <>
      <h2 className="block text-2xl my-4 font-thin">Change the game!</h2>
      <div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900 mb-2">
        <div className="w-full flex justify-between">
          {isLimited && !isLpRetrieved && (
            <div className="flex justify-center flex-col">
              <button
                onClick={() => {
                  remove();
                }}
                className="safu-button-secondary"
              >
                Remove Limits
              </button>
            </div>
          )}
          {!lpBurnt && !isLpRetrieved && (
            <>
              <div className="flex justify-center flex-col">
                <button
                  onClick={() => {
                    burn();
                  }}
                  className="safu-button-secondary"
                >
                  Burn LP
                </button>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center"
              >
                <div className="w-full rounded-3xl flex items-center">
                  <span className="text-xl text-gray-400 pr-4">Lock</span>
                  <input
                    type="text"
                    id="lock"
                    {...register("ldays", {
                      required: true,
                      min: 30,
                    })}
                    placeholder="30"
                    defaultValue="30"
                    className="block w-20 rounded-xl ps-2 py-1.5 mr-4 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl border-x border-gray-400"
                  />
                </div>
                <div className="flex justify-center flex-col">
                  <input
                    type="submit"
                    value="Extend"
                    className="safu-button-secondary cursor-pointer"
                  />
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Changes;
