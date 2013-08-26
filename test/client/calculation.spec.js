var basedir = '../../src/app/calculation/';

var SystemCost = require(basedir + 'SystemCost'),
    assert     = require('assert');
  
describe('SystemCost', function() {
    beforeEach(function() {
      SystemCost.constants = SystemCost.getConstants();
    });
  
    it('should return a valid output given valid inputs', function(){
      SystemCost.constants = {
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
      
      var system = {};
      var annualElectricityProduction = 0;
      var annualElectricityConsumption = 0;
      
      var systemCost = SystemCost.getSystemCost(system, annualElectricityProduction, annualElectricityConsumption);
      assert(systemCost.initialInvestment === 0);
      assert(systemCost.totalSystemCost[0].cost === 0);
      assert(systemCost.comparisonCost[0].cost === 0);
      assert(systemCost.paybackTime === 0);
    });

    describe('getEnergyIncome', function(){
      it('should calculate income from sell price if balance is positive', function(){
        SystemCost.constants.energySellPrice = 2;
        SystemCost.constants.energyBuyPrice = 10;
        var energyBalance = 10;
        var ane = 1;
        var result = SystemCost.getEnergyIncome(energyBalance, ane);
        assert(result === 20);
      });

      it('should calculate income from buy price if balance is negative', function(){
        SystemCost.constants.energySellPrice = 2;
        SystemCost.constants.energyBuyPrice = 10;
        var energyBalance = -10;
        var ane = 1;
        var result = SystemCost.getEnergyIncome(energyBalance, ane);
        assert(result === -100);
      });
    });

    describe('getRealInterestWithEscalation', function(){
      it('should return interest with escalation', function(){
        var realInterest = 0.02;
        var escalation = 0.01;
        var result = SystemCost.getRealInterestWithEscalation(realInterest, escalation);
        assert(Math.round(result * 100) / 100 === 0.01);
      });
    });

    describe('getPaybackTime', function(){
      it('should return the number of years until comparison cost exceeds total cost', function(){
        var totalSystemCost = [
          {year: 2013, cost: 15},
          {year: 2014, cost: 16},
          {year: 2015, cost: 17},
          {year: 2016, cost: 18},
          {year: 2017, cost: 19},
          {year: 2018, cost: 20},
        ];
        var comparisonCost = [
          {year: 2013, cost: 0},
          {year: 2014, cost: 5},
          {year: 2015, cost: 10},
          {year: 2016, cost: 15},
          {year: 2017, cost: 20},
          {year: 2018, cost: 25},
        ];
        
        var paybackTime = SystemCost.getPaybackTime(totalSystemCost, comparisonCost);
        
        assert(paybackTime === 4);
      });

      it('should return null if the comparison cost never equals or exceeds the system cost', function(){
        var totalSystemCost = [
          {year: 2013, cost: 21},
          {year: 2014, cost: 22},
          {year: 2015, cost: 23},
          {year: 2016, cost: 24},
          {year: 2017, cost: 25},
          {year: 2018, cost: 26},
        ];
        var comparisonCost = [
          {year: 2013, cost: 0},
          {year: 2014, cost: 5},
          {year: 2015, cost: 10},
          {year: 2016, cost: 15},
          {year: 2017, cost: 20},
          {year: 2018, cost: 25},
        ];
        
        var paybackTime = SystemCost.getPaybackTime(totalSystemCost, comparisonCost);
        
        assert(paybackTime === null);
      });

      it('should return 0 years if the costs are equal at start', function(){
        var totalSystemCost = [
          {year: 2013, cost: 15},
          {year: 2018, cost: 20}
        ];
        var comparisonCost = [
          {year: 2013, cost: 15},
          {year: 2014, cost: 20}
        ];
        
        var paybackTime = SystemCost.getPaybackTime(totalSystemCost, comparisonCost);
        
        assert(paybackTime === 0);
      });
    });
});
