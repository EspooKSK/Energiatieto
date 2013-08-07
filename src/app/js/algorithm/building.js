if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
        'underscore',
        './heating',
        './monthops'
    ], function(_, heating, monthops) {

        var consumptionType = 'heat';

        return function(buildYear, area, avgHeightInCm) {
            var volume = (area * avgHeightInCm) / 100.0,
                heat = heating.byYear(buildYear);

            this.getDailyConsumption = function(day, type) {
                if (type && consumptionType !== type) {
                    return 0;
                } else {
                    var mon = monthops.monthForDay(day),
                        monthly = heating.byMonth(mon) * volume * heat;

                    return monthly / monthops.numDays(mon);
                }
            };
        };
});
