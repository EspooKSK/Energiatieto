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
            this.chart.show(new ChartView({
                model: this.model,
                propertyName: this.options.opts.propertyName,
                chartOptions: {
                    width: 550
                }
            }));
        }
    });
});