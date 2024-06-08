import { UseFormSetValue } from "react-hook-form";

export interface LaunchForm {
	name: string;
	symbol: string;
	supply: number;
  initTaxType: number;
	initInterval: number;
	countInterval: number;
	maxBuyTax: number;
	minBuyTax: number;
	maxSellTax: number;
	minSellTax: number;
	lpTax: number;
	taxWallet: string;
	maxWallet: number;
	maxTx: number;
	preventSwap: number;
	maxSwap: number;
	taxSwapThreshold: number;
	amount: number;
}

export interface Template {
  supply: number;
  initTaxType: number;
  initInterval: number;
  countInterval: number;
  maxBuyTax: number;
  minBuyTax: number;
  maxSellTax: number;
  minSellTax: number;
  lpTax: number;
  maxWallet: number;
  maxTx: number;
  preventSwap: number;
  maxSwap: number;
  taxSwapThreshold: number;
  name: string;
  symbol: string;
}

export const updateFields = (
    setValue: UseFormSetValue<LaunchForm>,
    template: Template
): void => {
  setValue('supply', template.supply);
  setValue('initTaxType', template.initTaxType);
  setValue('initInterval', template.initInterval);
  setValue('countInterval', template.countInterval);
  setValue('maxBuyTax', template.maxBuyTax);
  setValue('minBuyTax', template.minBuyTax);
  setValue('maxSellTax', template.maxSellTax);
  setValue('minSellTax', template.minSellTax);
  setValue('lpTax', template.lpTax);
  setValue('maxWallet', template.maxWallet);
  setValue('maxTx', template.maxTx);
  setValue('preventSwap', template.preventSwap);
  setValue('maxSwap', template.maxSwap);
  setValue('taxSwapThreshold', template.taxSwapThreshold);
  setValue('name', template.name);
  setValue('symbol', template.symbol);
}

export const getArgs = ( address: `0x${string}`, staking_address: `0x${string}`, formData: LaunchForm, template: Template) => {
  return {
    owner: address,
    taxWallet: formData.taxWallet,
    stakingFacet: staking_address,
    v2router: staking_address,
    isFreeTier: true,
    minLiq: 0,
    supply: BigInt( formData.supply ),
    initTaxType: 0,
    initInterval: formData.initInterval ? formData.initInterval : template.initInterval,
    countInterval: formData.countInterval ? formData.countInterval : template.initInterval,
    maxBuyTax: formData.maxBuyTax ? formData.maxBuyTax : template.maxBuyTax,
    minBuyTax: formData.minBuyTax ? formData.minBuyTax : template.minBuyTax,
    maxSellTax: formData.maxSellTax ? formData.maxSellTax : template.maxSellTax,
    minSellTax: formData.minSellTax ? formData.minSellTax : template.minSellTax,
    lpTax: formData.lpTax ? formData.lpTax : template.lpTax,
    maxWallet: formData.maxWallet ? formData.maxWallet : template.maxWallet,
    maxTx: formData.maxTx ? formData.maxTx : template.maxTx,
    preventSwap: formData.preventSwap ? formData.preventSwap : template.preventSwap,
    maxSwap: BigInt( formData.maxSwap ? formData.maxSwap : template.maxSwap ),
    taxSwapThreshold: BigInt( formData.taxSwapThreshold ? formData.taxSwapThreshold : template.taxSwapThreshold ),
    name: formData.name,
    symbol: formData.symbol,
  };
}
