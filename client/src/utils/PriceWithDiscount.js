 const pricewithDiscount = (price, dis) => {
    const numericPrice = Number(price);
    const numericDiscount = Number(dis);

    if (isNaN(numericPrice) || numericPrice <= 0) {
        return 0;
    }

    if (isNaN(numericDiscount) || numericDiscount <= 0) {
        return numericPrice;
    }

    const discountAmount = Math.round((numericPrice * numericDiscount) / 100);
    let actualPrice = numericPrice - discountAmount;

    if (actualPrice < 0) {
        actualPrice = 0;
    }

    return actualPrice;
}

export default pricewithDiscount;