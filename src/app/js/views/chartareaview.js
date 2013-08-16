define([
        "jquery",
        "underscore",
        "backbone.marionette", 
        "hbs!./chartareaview.tmpl",
        "./chartview",
        "../models/buildinginfomodel",
        "./additionalchartview",
        "./systemcostview"
    ], function($, _, Marionette, tmpl, ChartView, BuildingInfoModel, AdditionalChartView, SystemCostView) {

        if (!_.sum) {
            _.mixin({
              sum : function(list) {
                return _.reduce(list, function(memo, num) { return memo + num; }, 0);
              }
            });
        }
        if (!_.positive) {
            _.mixin({
                positive: function(it) { return it > 0; }
            });
        }
        if (!_.negative) {
            _.mixin({
                negative: function(it) { return it < 0; }
            });
        }

    return Marionette.Layout.extend({
        template: {
            type: 'handlebars',
            template: tmpl
        },
        regions: {
            electricityConsumption  : "div.electricity-consumption",
            heatingConsumption      : "div.heating-consumption",
            electricityProduction   : "div.electricity-production",
            heatingProduction       : "div.heating-production",
            electricityBalance      : "div.electricity-balance",
            heatingBalance          : "div.heating-balance",
            systemCost              : "div.system-cost",

            firstAdditionalInfo     : "div.first-infoarea",
            secondAdditionalInfo    : "div.second-infoarea",
            thirdAdditionalInfo     : "div.third-infoarea"
        },
        initialize: function() {
            _.bindAll(this);
            var slideOpen = function(view) {
                var self = this;
                if (!this.isVisible) {
                    this.$el.hide();
                    this.$el.html(view.el);
                    this.$el.slideDown("fast", function() {
                        self.isVisible = true;
                    });
                } else {
                    this.$el.html(view.el);
                }
            };

            var self = this;
            _.each([
                "firstAdditionalInfo",
                "secondAdditionalInfo",
                "thirdAdditionalInfo"
            ], function(it) {
                self[it].open = slideOpen;
                self[it].slideUp = function(callback) {
                    var $el = this.$el;
                    $el.slideUp("fast", function() {
                        callback();
                        $el.show();
                    });
                };
            });

            this.charts = {
                electricityConsumption: {
                    propertyName: "electricityConsumption",
                    clickHandler: this.additionalInfo(this.firstAdditionalInfo),
                    sumElement  : ".electricity-consumption-total",
                    chartMin    : 0,
                    chartOptions: {
                        selectableBars: true
                    }
                },
                heatingConsumption: {
                    propertyName: "heatingConsumption",
                    clickHandler: this.additionalInfo(this.firstAdditionalInfo),
                    sumElement  : ".heating-consumption-total",
                    chartMin    : 0,
                    chartOptions: {
                        showQuantiles: true,
                        selectableBars: true
                    }
                },
                electricityProduction: {
                    propertyName: "electricityProduction",
                    clickHandler: this.additionalInfo(this.secondAdditionalInfo),
                    sumElement  : ".electricity-production-total",
                    chartMin    : 0,
                    chartOptions: {
                        selectableBars: true
                    }
                },
                heatingProduction: {
                    propertyName: "heatingProduction",
                    clickHandler: this.additionalInfo(this.secondAdditionalInfo),
                    sumElement  : ".heating-production-total",
                    chartMin    : 0,
                    chartOptions: {
                        showQuantiles: true,
                        selectableBars: true
                    }
                },
                electricityBalance: {
                    propertyName: "electricityBalance",
                    sumElement  : ".electricity-balance-total",
                    sumFunction : function(dataSets) {
                        var values = function(list, filter) {
                                return Math.round(_.chain(list).filter(filter).sum().value());
                            },
                            pos = values(dataSets.total, _.positive),
                            neg = values(dataSets.total, _.negative);
                        
                        return pos + " / " + Math.abs(neg);
                    },
                    clickHandler: this.additionalInfo(this.thirdAdditionalInfo),
                    chartOptions: {
                        showQuantiles: true,
                        selectableBars: true
                    }
                },
                heatingBalance: {
                    propertyName: "heatingBalance",
                    sumElement  : ".heating-balance-total",
                    sumFunction : function(dataSets) {
                        var values = function(list, filter) {
                                return Math.round(_.chain(list).filter(filter).sum().value());
                            },
                            pos = values(dataSets.water.total, _.positive) +
                                    values(dataSets.space.total, _.positive),
                            neg = values(dataSets.water.total, _.negative) +
                                    values(dataSets.space.total, _.negative);

                        return pos + " / " + Math.abs(neg);
                    },
                    clickHandler: this.additionalInfo(this.thirdAdditionalInfo),
                    chartOptions: {
                        showQuantiles: true,
                        selectableBars: true
                    }
                }
            };
            this.initViewsInCharts(this.charts);

            this.systemCostView = new SystemCostView({
                model: this.model
            });
        },
        initViewsInCharts: function(charts) {
            _.each(_.values(charts), this.initViewInChart);
        },
        initViewInChart: function(opts) {
            var clk = opts.clickHandler,
                self = this;
            opts.view = new ChartView({
                model         : this.model,
                propertyName  : opts.propertyName,
                rangeFn       : this.rangeFn(opts),
                chartOptions  : opts.chartOptions,
                series        : this.seriesFn(opts, "total")
            });
            if (opts.sumElement) {
                this.bindTo(this.model, "change:data", this.newSumCounter(opts.propertyName, opts.sumElement, opts.sumFunction));
            }
            if (typeof clk === "function") {
                opts.clickHandler = function() {
                    self.unselectNeighborChartBar(opts.propertyName);
                    clk.apply(clk, [opts].concat([].slice.call(arguments, 0)));
                };
            }
        },
        rangeFn: function(opts) {
            var charts = this.charts;
            var withRanges = function(prop) {
                return _[prop](_.map(charts, function(it) {
                    return it.view.dataSource.getDataRange()[prop];
                }));
            };
            return function() {
                var max = withRanges("max"),
                    min = withRanges("min");
                return {
                    max: max,
                    min: typeof opts.chartMin !== "undefined" ? opts.chartMin : min
                };
            };
        },
        seriesFn: function(opts, prop) {
            var self = this;
            return function() {
                var series = self.model.get("data")[opts.propertyName],
                    ret    = {};
                if (series[prop]) {
                    return {
                        total: series[prop]
                    };
                } else {
                    _.each(series, function(it, key) {
                        ret[key] = it[prop];
                    });
                    return ret;
                }
            };
        },
        newSumCounter: function(propertyName, sumElement, sumFunction) {
            var self = this;
            return function(model) {
                var dataSets = model.get("data")[propertyName],
                    sumFn = sumFunction || self.nestedSums,
                    sum = sumFn(dataSets);

                if ('' + sum) {
                    self.$(sumElement).text("");
                }
            };
        },
        nestedSums: function(dataSets) {
            if (dataSets.total) {
                return Math.round(_.sum(dataSets.total));
            } else {
                return Math.round(_.sum(_.map(dataSets, function(val, key) {
                    return _.sum(val.total);
                })));
            }
        },
        unselectNeighborChartBar: function(propertyName){
            var neighbors = {
              electricityConsumption: 'heatingConsumption',
              electricityProduction: 'heatingProduction',
              electricityBalance: 'heatingBalance',
              heatingConsumption: 'electricityConsumption',
              heatingProduction: 'electricityProduction',
              heatingBalance: 'electricityBalance'
            };
            var neighborChart = this.charts[neighbors[propertyName]];
            
            var modelChanged = !!neighborChart.chartOptions.selectedBar;
            if(modelChanged){
               neighborChart.chartOptions.selectedBar = null;
               neighborChart.view.modelChanged();
            }
        },
        additionalInfo: function(region) {
            var self = this;
          
            return function(opts, categoryIndex) {
                var view = new AdditionalChartView({
                    model: self.model,
                    chartOptions: opts.chartOptions,
                    categoryIndex: categoryIndex,
                    series : self.seriesFn(opts, "averages")
                });
                self.bindTo(view, "click:close", function() {
                    unselectAllBars(opts);
                    region.slideUp(function() {
                        region.reset();
                        region.isVisible = false;
                    });
                });
                region.show(view);
            };

            function unselectAllBars(options){
              options.chartOptions.selectedBar = null;
              options.view.modelChanged();
            }
        },
        onShow: function() {
            var self = this;
            _.each(_.pairs(this.charts), function(it) {
                self[it[0]].show(it[1].view);
                self.bindTo(it[1].view, "click", it[1].clickHandler);
            });
            this.systemCost.show(this.systemCostView);
        }
    });

});
