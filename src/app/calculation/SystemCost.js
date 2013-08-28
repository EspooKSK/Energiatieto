if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(["underscore"], function(_){
  return (function() {
    var self = this;
    
    this.getConstants = function(){
      return {
        nominalInterest: 0.05,
        inflation: 0.03,
        energyEscalation: 0.01,
        energyCost: 0,
        solarEnergySquareMeterPrice: 300,
        solarHeatSquareMeterPrice: 500,
        geoHeatKilowattPrice: 2000,
        energySellPrice: 0.04,
        energyBuyPrice: 0.12,
        yearlyMaintenanceCostPercentage: 0.05,
        systemLifespanInYears: 20,
        estimatedYearOfFailure: 10,
        estimatedAnnualCostPercentageForFailure: 0.02
      };
    };

    self.constants = this.getConstants();

    this.getSystemCost = function(system, annualElectricityProduction, annualElectricityConsumption){
      var r = this.getRealInterest();
      var solarInstallations = system.solarInstallation;
      var initialInvestment = this.getInitialInvestment(solarInstallations);
      var totalSystemCost = this.getTotalSystemCost(annualElectricityProduction, annualElectricityConsumption,
        r, initialInvestment);
      var comparisonCost = this.getComparisonCost(annualElectricityConsumption, r);
      var paybackTime = this.getPaybackTime(totalSystemCost, comparisonCost);
      
      var systemCost = {totalSystemCost: totalSystemCost,
                        comparisonCost: comparisonCost,
                        initialInvestment: initialInvestment,
                        paybackTime: paybackTime};
      return systemCost;
    };
    
    this.getTotalSystemCost = function(annualElectricityProduction, annualElectricityConsumption, r, initialInvestment){
      var maintenanceCost = this.getMaintenanceCost(initialInvestment);
      var annualEnergyBalance = annualElectricityProduction - annualElectricityConsumption;

      var re = this.getRealInterestWithEscalation(r);

      var years = _.range(self.constants.systemLifespanInYears + 1);
      var currentYear = getCurrentYear();
      return _.map(years, function(year) {
        return {
          year: currentYear + year,
          cost: this.getSystemCostForYear(year, r, re,
                                          initialInvestment, maintenanceCost, 
                                          annualEnergyBalance)
        };
      });
    };

    this.getSystemCostForYear = function(year, r, re,
                                         initialInvestment, maintenanceCost, 
                                         energyBalance){
      var additionalInvestment = this.getAdditionalInvestment(year, initialInvestment, r);
      var energyCost = self.constants.energyCost;

      var ay = this.getSingleOutput(r, year);
      var an = this.getRecurringOutput(r, year);
      var ane = this.getRecurringEscalationOutput(re, year);
      var incomeForYear = this.getEnergyIncome(energyBalance, ane);
      
      var adjustedMaintenanceCost = maintenanceCost * an;
      var adjustedEnergyCost = energyCost * ane;
      
      var systemCost = initialInvestment +
            adjustedMaintenanceCost +
            adjustedEnergyCost +
             additionalInvestment + 
            -incomeForYear;
      
      return systemCost;
    };
    
    this.getInitialInvestment = function(solarInstallations){
      var solarEnergyArea = _.reduce(solarInstallations, function(solarAreaSum, solarInstallation){
        return solarAreaSum + solarInstallation.photovoltaicArea;
      }, 0);
      var solarEnergyAreaCost = solarEnergyArea * self.constants.solarEnergySquareMeterPrice;

      var solarHeatArea = _.reduce(solarInstallations, function(solarAreaSum, solarInstallation){
        return solarAreaSum + solarInstallation.thermalArea;
      }, 0);
      var solarHeatAreaCost = solarHeatArea * self.constants.solarHeatSquareMeterPrice;
      
      var initialInvestment = solarEnergyAreaCost + solarHeatAreaCost;
      return initialInvestment;
    };

    this.getAdditionalInvestment = function(year, initialInvestment, r){
      if(year >= self.constants.estimatedYearOfFailure){
        var outputOnYearOfFailure = getSingleOutput(r, self.constants.estimatedYearOfFailure);
        var additionalInvestment = outputOnYearOfFailure * 
              self.constants.estimatedAnnualCostPercentageForFailure *
              initialInvestment;
        return additionalInvestment;
      } else {
        return 0;
      }
    };
    
    this.getMaintenanceCost = function(initialInvestment){
      return self.constants.yearlyMaintenanceCostPercentage * initialInvestment;
    };
    
    this.getRealInterest = function(){
      var i = constants.nominalInterest;
      var f = constants.inflation;
      return ((i - f) / (1 + f));
    };
    
    this.getSingleOutput = function(r, year){
      return 1 / Math.pow(1 + r, year);
    };
    
    this.getRecurringOutput = function(r, n){
      if(n === 0){
        return 1;
      }
      var i = self.constants.nominalInterest;
      return ((Math.pow(1 + r, n) - 1) / 
              (i * Math.pow(1 + r, n)));
    };
    
    this.getRecurringEscalationOutput = function(re, n){
      if(n === 0){
        return 1;
      }
      return ((Math.pow(1 + re, n) - 1) / 
              (re * Math.pow(1 + re, n)));
    };
    
    this.getRealInterestWithEscalation = function(r){
      var e = self.constants.energyEscalation;
      return ((r - e) / (1 + e));
    };
    
    this.getEnergyIncome = function(energyBalance, ane){
      var energyBuyPrice = self.constants.energyBuyPrice;
      var energySellPrice = self.constants.energySellPrice;
      var income;

      if(energyBalance > 0){
        income = energySellPrice * energyBalance * ane;
      } else {
        income = energyBuyPrice * energyBalance * ane;
      }
      
      return income;
    };
    
    this.getComparisonCost = function(annualElectricityConsumption, r){
      var re = this.getRealInterestWithEscalation(r);

      var currentYear = getCurrentYear();
      var years = _.range(self.constants.systemLifespanInYears + 1);
      var comparisonCost = _.map(years, function(year) {
        var energyCostAdjustment = this.getRecurringEscalationOutput(re, year);
        var energyCostForYear = annualElectricityConsumption * self.constants.energyBuyPrice * energyCostAdjustment;

        return {year: currentYear + year,
                cost: energyCostForYear};
      });
      return comparisonCost;
    };
    
    function getCurrentYear(){
      return new Date().getFullYear();
    }
    
    this.getPaybackTime = function(totalSystemCost, comparisonCost){
      var paybackElem = _.find(totalSystemCost, function(totalYearCost, index){
        return totalYearCost.cost <= comparisonCost[index].cost;
      });

      if(!paybackElem) return null;

      var paybackTime = paybackElem.year - totalSystemCost[0].year;
      return paybackTime;
    };
    
    return this;
  })();
});
