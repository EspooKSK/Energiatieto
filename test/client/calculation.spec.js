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

    describe('getAnnualEnergyBalance', function(){
      it('should return the total energy balance (production - consumption)', function(){
        var monthlyProduction =  [1, 1, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0];
        var monthlyConsumption = [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
        assert(SystemCost.getAnnualEnergyBalance(monthlyProduction, monthlyConsumption) === 1);
      });
    });
});
