define([
        "backbone",
        "backbone.marionette", 
        "bootstrap",
        "hbs!./mainview.tmpl",
        "hbs!./clearconfirmation.tmpl",

        "./chartareaview",
        "../models/chartareamodel",
        "./rightpanelview",
    ], 
    function(
        Backbone,
        Marionette, 
        bootstrap,
        tmpl,
        clearconfirmationtmpl,

        ChartAreaView,
        ChartAreaModel,
        RightPanelView
    ) {

    var MainView = Marionette.Layout.extend({
        className: 'master',
        template: {
            type: 'handlebars',
            template: tmpl
        },
        regions: {
            rightpanel  : '.panel.right',
            charts      : '.chart-area'
        },
        initialize: function(options) {
            _.bindAll(this);
            
            var self       = this,
                chartModel = this.chartModel = new ChartAreaModel(options.model);

            this.ChartArea = new ChartAreaView({
              model: chartModel
            });

            this.rightPanelView = new RightPanelView({model: this.model});
        },
        onShow: function() {
            // must be before rightpanel is displayed
            // or chart energy sums won't show initially
            this.charts.show(this.ChartArea);

            this.rightpanel.show(this.rightPanelView);
            
            this.initClearConfirmationPopover();
        },
        initClearConfirmationPopover: function() {
            var self = this;
            var clearButton = this.$('#clearAllMapObjectsButton');
            clearButton.popover({
                placement: 'bottom',
                title: 'Oletko varma?',
                html: true,
                content: clearconfirmationtmpl,
                container: '.master'
            }).click(function() {
                self.$('.popover-content #confirmClearAllMapObjectsButton').click(function() {
                    self.clearAllMapObjects();
                    clearButton.popover('hide');
                });
                self.$('.popover-content .cancel').click(function() {
                    clearButton.popover('hide');
                });
            });
        },
        clearAllMapObjects: function() {
            this.rightPanelView.clearAllMapObjects();
        },
    });
    return MainView;
});
