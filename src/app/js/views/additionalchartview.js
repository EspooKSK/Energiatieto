define([
        "backbone.marionette", 
        "hbs!./additionalchartview.tmpl", 
        "../algorithm/facade",
        "./chartview"
    ], function(Marionette, tmpl, Algorithm, ChartView) {
    return Marionette.Layout.extend({
        template: {
            template: tmpl,
            type: "handlebars"
        },
        regions: {
            chart: ".chart"
        },
        triggers: {
            "click .close": "click:close"
        },
        onShow: function() {
            var self = this;
            this.chartView = new ChartView({
                model: this.model,
                series: function() {
                    var series = self.options.series(),
                        ret = {};
                    _.each(series, function(month, key) {
                        ret[key] = month[self.options.categoryIndex];
                    });
                    return ret;
                },
                propertyName  : this.options.propertyName,
                chartOptions: {
                    width: 550,
                    selectableBars: false
                }
            });
            this.chart.show(this.chartView);
        },
      modelChanged: function() {
          this.chartView.modelChanged();
      }
    });
});
