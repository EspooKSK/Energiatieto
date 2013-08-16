define([
    "backbone.marionette",
    "hbs!./systemcostview.tmpl",
    "backbone.modelbinder",
    "./linechartview"
    ], function(Marionette, tmpl, modelBinder, LineChartView) {
        return Marionette.Layout.extend({
            template: {
                template: tmpl,
                type: "handlebars"
            },
            regions: {
                lineChart: "div.system-cost-line-chart"
            },
            initialize: function() {
              _.bindAll(this);
                this.bindTo(this.model, "change:data", this.modelChanged);
                this.lineChartView = new LineChartView({
                    model: this.model
                });
            },
            onShow: function() {
                this.lineChart.show(this.lineChartView);
            },
            modelChanged: function() {
                var systemCost = this.model.get('data').systemCost;
                this.$('#initial-investment').text(systemCost.initialInvestment);
                this.$('#payback-period').text(systemCost.paybackPeriod);
                this.lineChartView.modelChanged();
            }
        });
});
