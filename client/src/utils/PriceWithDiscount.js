export const PriceWithDiscount = (price, discount = 0) => {
  const numericPrice = Number(price);
  const numericDiscount = Number(discount);

  // Validate inputs
  if (
    Number.isNaN(numericPrice) ||
    numericPrice < 0 ||
    Number.isNaN(numericDiscount) ||
    numericDiscount < 0
  ) {
    return 0;
  }

  // No discount
  if (numericDiscount === 0) {
    return Math.round(numericPrice);
  }

  const discountAmount = (numericPrice * numericDiscount) / 100;
  const finalPrice = numericPrice - discountAmount;

  //Optional: If you want paise-level precision
   return Number(finalPrice.toFixed(2));

  // return the rounded off value
  //return Math.round(finalPrice);
};
