const getCostForOrder = (fromLocation, toLocation, orderDetails) => {
    // advanced algorithm to calculate the cost
    const price = (Math.random() * 20) + 10;
    const priceRoundedToTwoDecimals = Math.round(price * 100) / 100;
    return priceRoundedToTwoDecimals
  }
  
  module.exports = {
    getCostForOrder,
  }