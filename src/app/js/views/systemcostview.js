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
                this.displayPaybackTime();
                this.lineChartView.modelChanged();
            },
          displayPaybackTime: function() {
            var paybackTime = this.model.get('data').systemCost.paybackTime;
            if(paybackTime){
              this.$('#payback-time').text(systemCost.paybackTime);
              if(systemCost.paybackTime === 1){
                this.$('.years').text("vuosi");
              } else {
                this.$('.years').text("vuotta");
              }
            } else {
              this.$('#payback-time').text("20+");
              this.$('.years').text("vuotta");
            }
          }
        });
});
