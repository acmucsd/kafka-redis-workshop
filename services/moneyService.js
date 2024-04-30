const getCostBetweenLocations = (fromLocation, toLocation) => {
    // compute random cost between 10 and 30 lol
    const price = (Math.random() * 20) + 10;
    const priceRoundedToTwoDecimals = Math.round(price * 100) / 100;
    return priceRoundedToTwoDecimals
  }
  
  module.exports = {
    getCostBetweenLocations,
  }