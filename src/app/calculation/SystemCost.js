if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

var NOMINAL_INTEREST = 0.05,
    INFLATION = 0.03,
    ENERGY_ESCALATION = 0.01,
    ENERGY_COST = 0,
    SOLAR_ENERGY_SQUARE_METER_PRICE = 300,
    SOLAR_HEAT_SQUARE_METER_PRICE = 500,
    GEO_HEAT_KILOWATT_PRICE = 2000,
    ENERGY_SELL_PRICE = 0.04,
    ENERGY_BUY_PRICE = 0.12,
    YEARLY_MAINTENANCE_COST_PERCENTAGE = 0.05,
    SYSTEM_LIFESPAN_IN_YEARS = 20,
    ESTIMATED_YEAR_OF_FAILURE = 10,
    ESTIMATED_ANNUAL_COST_PERCENTAGE_FOR_FAILURE = 0.02;

define(["underscore"], function(_){
  return (function() {
    this.getSystemCost = function(system, constants, electricityProduction, electricityConsumption){
      var numYears = SYSTEM_LIFESPAN_IN_YEARS;

      var r = this.getRealInterest(NOMINAL_INTEREST, INFLATION);
      var re = this.getRealInterestWithEscalation(r, ENERGY_ESCALATION);
      var initialInvestment = this.getInitialInvestment(system, electricityConsumption);
      var additionalInvestment = this.getAdditionalInvestment(initialInvestment, r);
      var maintenanceCost = this.getMaintenanceCost(initialInvestment);
      var energyCost = ENERGY_COST;

      var annualEnergyBalance = this.getAnnualEnergyBalance(electricityProduction.total, electricityConsumption.total);
      
      var currentYear = new Date().getFullYear();
      var years = _.range(numYears + 1);
      var totalSystemCost = _.map(years, function(year) {
        return {
          year: currentYear + year,
          cost: this.getSystemCostForYear(year, NOMINAL_INTEREST, r, 
                                          initialInvestment, maintenanceCost, ENERGY_COST,
                                          re, additionalInvestment,
                                          annualEnergyBalance)
        };
      });

      return {totalSystemCost: totalSystemCost,
              initialInvestment: initialInvestment};
    };

    this.getSystemCostForYear = function(year, i, r, 
                                         initialInvestment, maintenanceCost, energyCost, 
                                         re, additionalInvestment, energyBalance){
      var ay = this.getSingleOutput(r, year);
      var an = this.getRecurringOutput(r, year, i);
      var ane = this.getRecurringEscalationOutput(re, year);
      var incomeForYear = this.getEnergyIncome(ENERGY_SELL_PRICE, ENERGY_BUY_PRICE, energyBalance, ane);
      
      var systemCost = initialInvestment +
            maintenanceCost * an +
            energyCost * ane +
            additionalInvestment * ay -
            incomeForYear;
      return systemCost;
    };
    
    this.getInitialInvestment = function(system, electricityConsumption){
      var solarInstallations = system.solarInstallation;

      var solarEnergyArea = _.reduce(solarInstallations, function(solarAreaSum, solarInstallation){
        return solarAreaSum + solarInstallation.photovoltaicArea;
      }, 0);
      var solarEnergyAreaCost = solarEnergyArea * SOLAR_ENERGY_SQUARE_METER_PRICE;

      var solarHeatArea = _.reduce(solarInstallations, function(solarAreaSum, solarInstallation){
        return solarAreaSum + solarInstallation.thermalArea;
      }, 0);
      var solarHeatAreaCost = solarHeatArea * SOLAR_HEAT_SQUARE_METER_PRICE;

      return solarEnergyAreaCost + solarHeatAreaCost;
    };

    this.getAdditionalInvestment = function(initialInvestment, r){
      var outputOnYearOfFailure = getSingleOutput(r, ESTIMATED_YEAR_OF_FAILURE);
      var additionalInvestment = outputOnYearOfFailure * 
        ESTIMATED_ANNUAL_COST_PERCENTAGE_FOR_FAILURE *
        initialInvestment;
      return additionalInvestment;
    };
    
    this.getMaintenanceCost = function(initialInvestment){
      return YEARLY_MAINTENANCE_COST_PERCENTAGE * initialInvestment;
    };
    
    this.getRealInterest = function(i, f){
      return ((i - f) / (1 + f));
    };
    
    this.getSingleOutput = function(r, year){
      return 1 / Math.pow(1 + r, year);
    };
    
    this.getRecurringOutput = function(r, numYears, i){
      return ((Math.pow(1 + r, numYears) - 1) / 
              (i * Math.pow(1 + r, numYears)));
    };
    
    this.getRecurringEscalationOutput = function(re, n){
      return ((Math.pow(1 + re, n) - 1) / 
              (re * Math.pow(1 + re, n)));
    };
    
    this.getRealInterestWithEscalation = function(r, e){
      return ((r - e) / (1 + e));
    };
    
    this.getEnergyIncome = function(energySellPrice, energyBuyPrice, energyBalance, ane){
      if(energyBalance > 0){
        return energySellPrice * energyBalance * ane;
      } else {
        return energyBuyPrice * energyBalance * ane;
      }
    };
    
    this.getAnnualEnergyBalance = function(monthlyProduction, monthlyConsumption){
      var annualElectricityProduction = _.reduce(monthlyProduction, function(prodSum, monthlyTotal){
        return prodSum + monthlyTotal;
      });
      var annualElectricityConsumption = _.reduce(monthlyConsumption, function(consSum, monthlyTotal){
        return consSum + monthlyTotal;
      });
      return annualElectricityProduction - annualElectricityConsumption;
    };
    
    return this;
  })();
});
