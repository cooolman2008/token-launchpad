import { UseFormResetField, UseFormSetValue } from "react-hook-form";

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
    resetField: UseFormResetField<LaunchForm>,
    template: Template,
): void => {
  if(template.symbol === "EMPTY") {
    resetField('supply');
    resetField('name');
    resetField('symbol');
  } else {
    setValue('supply', template.supply);
    setValue('name', template.name);
    setValue('symbol', template.symbol);
  }
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
}
