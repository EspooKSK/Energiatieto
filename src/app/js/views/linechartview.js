define([
        "backbone.marionette", 
        "hbs!./linechartview.tmpl",
        "linechart",
    ], function(Marionette, tmpl, LineChart) {
        return Marionette.ItemView.extend({
            template: {
                type: 'handlebars',
                template: tmpl
            },
            initialize: function(options) {
                _.bindAll(this);
                this.bindTo(this.model, "change", this.modelChanged);
            },
            onShow: function() {
                this.chart = new LineChart(this.$("svg")[0]).draw(this.getChartData());
            },
            modelChanged: function() {
                this.chart.redraw(this.getChartData());
            },
            getChartData: function() {
              console.log(this.model.get('data'));
              var systemCost = this.model.get('data').systemCost.totalSystemCost;
              var comparisonCost = this.model.get('data').systemCost.comparisonCost;
              return [systemCost, comparisonCost];
            }
        });
});
