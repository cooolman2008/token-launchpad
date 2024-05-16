import { useContractWrite, useWalletClient } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { parseEther, formatEther } from "viem";
import { useEffect, useState } from "react";

import Helperabi from "../../../../helperabi.json";
import { fetchPromoCost } from "@/api/getSafu";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

interface PromoteForm {
  cost: number;
  times: number;
}

const Promote = ({ contractAddress }: { contractAddress: `0x${string}` }) => {
  const { data: walletClient } = useWalletClient();
  const [promoCost, setPromoCost] = useState(0);

  useEffect(() => {
    async function fetchTheCost() {
      const data = await fetchPromoCost(CONTRACT_ADDRESS);
      if (data) {
        setPromoCost(Number(formatEther(data)));
        setValue("cost", Number(formatEther(data)));
      }
    }
    fetchTheCost();
  }, []);

  // contract call to start trading of the launched token.
  const {
    data,
    isSuccess,
    write: promote,
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: Helperabi.abi,
    functionName: "promoteToken",
    account: walletClient?.account,
    onSuccess(res) {
      console.log(res);
    },
    onError(error) {
      console.log(error);
    },
  });

  // handle form & launch promote token utility with number of times to promote
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PromoteForm>();
  const onSubmit: SubmitHandler<PromoteForm> = (formData) => {
    // console.log(parseEther(promoCost.toString()) * BigInt(formData.times));
    if (promoCost) {
      promote({
        args: [contractAddress, formData.times],
        value: parseEther(promoCost.toString()) * BigInt(formData.times),
      });
    }
  };

  return (
    <>
      <div className="flex mb-4">
        <h2 className="text-2xl font-thin">Promote this token!</h2>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 fill-gray-600 hover:fill-gray-400 cursor-pointer ml-1"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12.02 17.5C11.468 17.5 11.0149 17.052 11.0149 16.5C11.0149 15.948 11.458 15.5 12.01 15.5H12.02C12.573 15.5 13.02 15.948 13.02 16.5C13.02 17.052 12.572 17.5 12.02 17.5ZM13.603 12.5281C12.872 13.0181 12.7359 13.291 12.7109 13.363C12.6059 13.676 12.314 13.874 12 13.874C11.921 13.874 11.841 13.862 11.762 13.835C11.369 13.703 11.1581 13.278 11.2891 12.885C11.4701 12.345 11.9391 11.836 12.7671 11.281C13.7881 10.597 13.657 9.84707 13.614 9.60107C13.501 8.94707 12.95 8.38988 12.303 8.27588C11.811 8.18588 11.3301 8.31488 10.9541 8.62988C10.5761 8.94688 10.3589 9.41391 10.3589 9.90991C10.3589 10.3239 10.0229 10.6599 9.60889 10.6599C9.19489 10.6599 8.85889 10.3239 8.85889 9.90991C8.85889 8.96891 9.27099 8.08396 9.98999 7.48096C10.702 6.88496 11.639 6.63605 12.564 6.80005C13.831 7.02405 14.8701 8.07097 15.0911 9.34497C15.3111 10.607 14.782 11.7381 13.603 12.5281Z"></path>
        </svg>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900 mb-2">
          <label className="block text-sm leading-6 text-gray-400">
            Start Promoting
          </label>
          <div className="w-full flex">
            <div className="w-full rounded-3xl flex items-center">
              <span className="text-xl text-gray-400 pr-4">Cost</span>
              <input
                type="text"
                id="cost"
                placeholder="30"
                {...register("cost", {
                  valueAsNumber: true,
                  disabled: true,
                })}
                className="block w-20 rounded-xl ps-2 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl border-l border-gray-400"
              />
            </div>
            <div className="w-full rounded-3xl flex items-center">
              <span className="text-xl text-gray-400 pr-4">Times</span>
              <input
                type="text"
                id="times"
                placeholder="2"
                {...register("times", {
                  required: true,
                  min: 1,
                })}
                defaultValue={2}
                className="block w-20 rounded-xl ps-2 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl border-l border-gray-400 appearance-none"
              />
            </div>
            <div className="flex justify-center flex-col">
              <input
                type="submit"
                value="Promote"
                className="safu-button-secondary cursor-pointer"
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Promote;
