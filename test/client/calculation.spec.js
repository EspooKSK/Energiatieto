var basedir = '../../src/app/calculation/';

var SystemCost = require(basedir + 'SystemCost'),
    assert     = require('assert');
  
describe('SystemCost', function() {

    describe('getEnergyIncome', function(){
      it('should calculate income from sell price if balance is positive', function(){
        var sellPrice = 2;
        var buyPrice = 10;
        var energyBalance = 10;
        var ane = 1;
        var result = SystemCost.getEnergyIncome(sellPrice, buyPrice, energyBalance, ane);
        assert(result === 20);
      });

      it('should calculate income from buy price if balance is negative', function(){
        var sellPrice = 2;
        var buyPrice = 10;
        var energyBalance = -10;
        var ane = 1;
        var result = SystemCost.getEnergyIncome(sellPrice, buyPrice, energyBalance, ane);
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
