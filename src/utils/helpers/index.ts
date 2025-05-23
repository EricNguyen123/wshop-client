/**
 * Convert large numbers to K (thousand), M (million), B (billion) format
 * @param {number} num - Number to convert
 * @param {number} digits - Number of decimal places after the decimal point (default is 1)
 * @returns {string} - Formatted string
 */
export interface FormatNumberOptions {
  num: number;
  digits?: number;
}

export function formatNumber(num: number, digits: number = 1): string {
  if (isNaN(num) || num === null) return '0';

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1000000000) {
    return sign + (absNum / 1000000000).toFixed(digits).replace(/\.0+$/, '') + 'B';
  } else if (absNum >= 1000000) {
    return sign + (absNum / 1000000).toFixed(digits).replace(/\.0+$/, '') + 'M';
  } else if (absNum >= 1000) {
    return sign + (absNum / 1000).toFixed(digits).replace(/\.0+$/, '') + 'K';
  } else {
    return sign + absNum.toFixed(0);
  }
}

/**
 * Converts integer to currency format
 * @param amount Amount to format
 * @param options Format options
 * @returns String formatted in currency
 */
export function formatCurrency(
  amount: number | undefined | null,
  options: {
    /**
     *Currency code (VND, USD, EUR, etc.)
     * @default 'VND'
     */
    currency?: string;

    /**
     * Position of currency symbol: 'before' or 'after'
     * @default 'after' for VND, 'before' for other currencies
     */
    symbolPosition?: 'before' | 'after';

    /**
     * Number of decimal places after the decimal point
     * @default 0 for VND, 2 for other currencies
     */
    decimalPlaces?: number;

    /**
     * Thousandths separator
     * @default '.'
     */
    thousandSeparator?: string;

    /**
     * Decimal separator character
     * @default ','
     */
    decimalSeparator?: string;

    /**
     * Custom currency symbol (₫, $, €, etc.)
     * If not set, will use currency code as symbol
     */
    symbol?: string;

    /**
     * Is currency symbol displayed?
     * @default true
     */
    showSymbol?: boolean;

    /**
     * Does it display 0?
     * @default false
     */
    showZero?: boolean;

    /**
     * Can large numbers be reduced to K, M, B (1000 -> 1K)?
     * @default false
     */
    compact?: boolean;
  } = {}
): string {
  if (amount === null || amount === undefined) {
    return '';
  }

  const { currency = 'VND', showSymbol = true, showZero = false, compact = false } = options;

  const isVND = currency === 'VND';
  const decimalPlaces = options.decimalPlaces ?? (isVND ? 0 : 2);
  const symbolPosition = options.symbolPosition ?? (isVND ? 'after' : 'before');
  const thousandSeparator = options.thousandSeparator ?? '.';
  const decimalSeparator = options.decimalSeparator ?? ',';

  let symbol = options.symbol || currency;
  if (currency === 'VND') {
    symbol = options.symbol || '₫';
  } else if (currency === 'USD') {
    symbol = options.symbol || '$';
  } else if (currency === 'EUR') {
    symbol = options.symbol || '€';
  }

  if (amount === 0 && !showZero) {
    return '0';
  }

  if (compact) {
    const absValue = Math.abs(amount);
    if (absValue >= 1_000_000_000) {
      return formatCurrency(amount / 1_000_000_000, {
        ...options,
        compact: false,
        symbol: 'B',
        symbolPosition: 'after',
      });
    } else if (absValue >= 1_000_000) {
      return formatCurrency(amount / 1_000_000, {
        ...options,
        compact: false,
        symbol: 'M',
        symbolPosition: 'after',
      });
    } else if (absValue >= 1_000) {
      return formatCurrency(amount / 1_000, {
        ...options,
        compact: false,
        symbol: 'K',
        symbolPosition: 'after',
      });
    }
  }

  const numberFormat = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: true,
  });

  let formattedNumber = numberFormat.format(amount);

  formattedNumber = formattedNumber
    .replace(/\./g, '#THOUSAND#')
    .replace(/,/g, '#DECIMAL#')
    .replace(/#THOUSAND#/g, thousandSeparator)
    .replace(/#DECIMAL#/g, decimalSeparator);

  if (showSymbol) {
    if (symbolPosition === 'before') {
      return `${symbol}${formattedNumber}`;
    } else {
      return `${formattedNumber}${symbol}`;
    }
  }

  return formattedNumber;
}

/**
 * Format the discount value
 * @param {number|string} value - Discount value
 * @param {string} type - Discount type ('percent', 'amount', 'auto')
 * @param {string} currency - Currency (default: 'đ')
 * @param {boolean} showPlus - Show + sign for positive discount (default: false)
 * @returns {string} - Formatted string
 */
export type DiscountType = 'percent' | 'amount' | 'auto';

export interface FormatDiscountOptions {
  value: number | string;
  type?: DiscountType;
  currency?: string;
  showPlus?: boolean;
}

export function formatDiscount(
  value: number | string,
  type: DiscountType = 'auto',
  currency: string = 'đ',
  showPlus: boolean = false
): string {
  const numValue: number = parseFloat(value as string);

  if (isNaN(numValue)) {
    return '0';
  }

  let discountType: DiscountType = type;
  let computedValue: number | string = value;
  if (type === 'auto') {
    if ((numValue > -1 && numValue < 0) || (numValue > 0 && numValue < 1)) {
      discountType = 'percent';

      computedValue = numValue * 100;
    } else {
      discountType = 'amount';
    }
  }

  const sign: string = numValue < 0 ? '-' : showPlus && numValue > 0 ? '+' : '';

  const absValue: number = Math.abs(numValue);

  if (discountType === 'percent') {
    const absPercent: number =
      type === 'auto' && numValue > -1 && numValue < 1
        ? Math.abs(computedValue as number)
        : absValue;

    const formattedPercent: string = absPercent.toFixed(2).replace(/\.0$/, '');
    return `${sign}${formattedPercent}%`;
  } else {
    const formattedAmount: string = absValue.toLocaleString('vi-VN');
    return `${sign}${formattedAmount}${currency}`;
  }
}

/**
 * Format to display full discount information
 * @param {number|string} originalPrice - Original Price
 * @param {number|string} discount - Discount value
 * @param {string} discountType - Discount type ('percent', 'amount', 'auto')
 * @param {string} currency - Currency
 * @returns {object} - Object containing formatted information
 */
export interface FormatPriceDiscountResult {
  originalPrice: string;
  originalPriceCompact: string;
  discount: string;
  finalPrice: string;
  finalPriceCompact: string;
  savedAmount: string;
  discountDisplay: string;
  savePercent: string;
}

export function formatPriceDiscount(
  originalPrice: number | string,
  discount: number | string,
  discountType: DiscountType = 'auto',
  currency: string = 'đ'
): FormatPriceDiscountResult {
  const origPrice: number = parseFloat(originalPrice as string);
  const discValue: number = parseFloat(discount as string);

  if (isNaN(origPrice) || isNaN(discValue)) {
    return {
      originalPrice: '0' + currency,
      originalPriceCompact: '0' + currency,
      discount: '0',
      finalPrice: '0' + currency,
      finalPriceCompact: '0' + currency,
      savedAmount: '0' + currency,
      discountDisplay: '',
      savePercent: '',
    };
  }

  let finalPrice: number;
  let savedAmount: number;

  if (
    discountType === 'percent' ||
    (discountType === 'auto' && discValue > -1 && discValue < 1 && discValue !== 0)
  ) {
    const discountPercent: number = discountType === 'auto' ? discValue : discValue / 100;
    savedAmount = origPrice * Math.abs(discountPercent);
    finalPrice = origPrice - savedAmount;
  } else {
    savedAmount = Math.abs(discValue);
    finalPrice = origPrice - savedAmount;
  }

  finalPrice = Math.max(0, finalPrice);

  const savePercent: number = origPrice !== 0 ? (savedAmount / origPrice) * 100 : 0;

  return {
    originalPrice: origPrice.toLocaleString('vi-VN') + currency,
    originalPriceCompact: formatNumber(origPrice) + currency,
    discount: formatDiscount(discount, discountType, currency),
    finalPrice: finalPrice.toLocaleString('vi-VN') + currency,
    finalPriceCompact: formatNumber(finalPrice) + currency,
    savedAmount: savedAmount.toLocaleString('vi-VN') + currency,
    discountDisplay: savedAmount > 0 ? `-${formatDiscount(savePercent, 'percent')}` : '',
    savePercent: savePercent.toFixed(1).replace(/\.0$/, '') + '%',
  };
}

/**
 * Display format of Multiplication Rate value
 * @param {number|string} rate - Multiplication rate value
 * @param {Object} options - Format options
 * @param {string} options.format - Display format ('times', 'x', 'multiply', 'percent', 'auto'), default: 'auto'
 * @param {number} options.digits - Number of decimal places, default: 1
 * @param {boolean} options.showPlus - Show + sign for increment value, default: false
 * @param {boolean} options.colorCode - Add CSS class based on value, default: false
 * @returns {Object} - Object containing formatted values
 */
export type MultiplicationRateFormat = 'times' | 'x' | 'multiply' | 'percent' | 'auto';

export interface FormatMultiplicationRateOptions {
  format?: MultiplicationRateFormat;
  digits?: number;
  showPlus?: boolean;
  colorCode?: boolean;
}

export interface FormatMultiplicationRateResult {
  displayText: string;
  numericValue: number;
  percentChange: string;
  absPercentChange: string;
  colorClass: string;
  isIncrease: boolean;
  isDecrease: boolean;
}

export function formatMultiplicationRate(
  rate: number | string,
  options: FormatMultiplicationRateOptions = {}
): FormatMultiplicationRateResult {
  const { format = 'auto', digits = 1, showPlus = false, colorCode = false } = options;

  const numRate = parseFloat(rate as string);

  if (isNaN(numRate)) {
    return {
      displayText: '1x',
      numericValue: 1,
      percentChange: '0%',
      absPercentChange: '0%',
      colorClass: 'neutral',
      isIncrease: false,
      isDecrease: false,
    };
  }

  let displayText = '';
  const percentChange = ((numRate - 1) * 100).toFixed(digits).replace(/\.0+$/, '');
  // const absRate = Math.abs(numRate);

  let displayFormat: MultiplicationRateFormat = format;
  if (format === 'auto') {
    if (numRate >= 0.8 && numRate <= 1.2) {
      displayFormat = 'percent';
    } else {
      displayFormat = 'x';
    }
  }

  switch (displayFormat) {
    case 'times':
      displayText = numRate.toFixed(digits).replace(/\.0+$/, '') + ' times';
      break;
    case 'x':
      displayText = numRate.toFixed(digits).replace(/\.0+$/, '') + 'x';
      break;
    case 'multiply':
      displayText = '×' + numRate.toFixed(digits).replace(/\.0+$/, '');
      break;
    case 'percent':
      const sign = numRate > 1 ? (showPlus ? '+' : '') : numRate < 1 ? '-' : '';
      displayText = sign + Math.abs(Number(percentChange)) + '%';
      break;
    default:
      displayText = numRate.toFixed(digits).replace(/\.0+$/, '') + 'x';
  }

  let colorClass = 'neutral';
  if (colorCode) {
    if (numRate > 1) {
      colorClass = 'increase';
    } else if (numRate < 1) {
      colorClass = 'decrease';
    }
  }

  return {
    displayText: displayText,
    numericValue: numRate,
    percentChange: (numRate > 1 ? '+' : '') + percentChange + '%',
    absPercentChange: Math.abs(Number(percentChange)) + '%',
    colorClass: colorClass,
    isIncrease: numRate > 1,
    isDecrease: numRate < 1,
  };
}

/**
 * Apply Multiplication Rate to value
 * @param {number} baseValue - Base value
 * @param {number} rate - Multiplier
 * @param {Object} options - Format options
 * @returns {Object} - Object containing calculated values
 */
export interface ApplyMultiplicationRateOptions {
  currency?: string;
  roundMethod?: 'none' | 'ceiling' | 'floor' | 'round' | number;
  displayFormat?: MultiplicationRateFormat;
  digits?: number;
}

export interface ApplyMultiplicationRateResult {
  originalValue: string;
  multipliedValue: string;
  newValue: number;
  difference: string;
  differenceFormatted: string;
  rate: FormatMultiplicationRateResult;
}

export function applyMultiplicationRate(
  baseValue: number | string,
  rate: number | string,
  options: ApplyMultiplicationRateOptions = {}
): ApplyMultiplicationRateResult {
  const { currency = 'đ', roundMethod = 'none', displayFormat = 'auto', digits = 0 } = options;

  const numBase = parseFloat(baseValue as string);
  const numRate = parseFloat(rate as string);

  if (isNaN(numBase) || isNaN(numRate)) {
    return {
      originalValue: formatCurrency(0),
      multipliedValue: formatCurrency(0),
      newValue: 0,
      difference: formatCurrency(0),
      differenceFormatted: '+0' + currency,
      rate: formatMultiplicationRate(1),
    };
  }

  let newValue = numBase * numRate;

  if (roundMethod === 'ceiling') {
    newValue = Math.ceil(newValue);
  } else if (roundMethod === 'floor') {
    newValue = Math.floor(newValue);
  } else if (roundMethod === 'round') {
    newValue = Math.round(newValue);
  } else if (typeof roundMethod === 'number') {
    newValue = Math.round(newValue / roundMethod) * roundMethod;
  }

  const difference = newValue - numBase;

  const rateFormatted = formatMultiplicationRate(numRate, {
    format: displayFormat,
    digits: digits,
    colorCode: true,
  });

  return {
    originalValue: formatCurrency(numBase),
    multipliedValue: formatCurrency(newValue),
    newValue: newValue,
    difference: formatCurrency(difference),
    differenceFormatted: (difference >= 0 ? '+' : '') + formatCurrency(difference),
    rate: rateFormatted,
  };
}
