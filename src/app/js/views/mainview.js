define([
        "backbone",
        "backbone.marionette", 
        "bootstrap",
        "hbs!./mainview.tmpl",
        "hbs!./clearconfirmation.tmpl",
        "hbs!./instructionview.tmpl",
        "../models/selectedbuildings",

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
        instructionviewtmpl,
        selectedBuildings,

        ChartAreaView,
        ChartAreaModel,
        RightPanelView
    ) {

    var InstructionsView = Marionette.ItemView.extend({
        template: {
            type: 'handlebars',
            template: instructionviewtmpl
        }
    });

    var MainView = Marionette.Layout.extend({
        className: 'master',
        template: {
            type: 'handlebars',
            template: tmpl
        },
        regions: {
            rightpanel  : '.panel.right',
            leftpanel   : '.chart-area'
        },
        initialize: function(options) {
            _.bindAll(this);
            
            var self       = this,
                chartModel = this.chartModel = new ChartAreaModel(options.model);

            this.ChartArea = new ChartAreaView({
              model: chartModel
            });

            this.instructionView = new InstructionsView();
            selectedBuildings.on('add', function() {
                self.leftpanel.show(self.ChartArea);
            });

            this.rightPanelView = new RightPanelView({model: this.model});
        },
        onShow: function() {
            // must be before rightpanel is displayed
            // or chart energy sums won't show initially
            selectedBuildings.fetch();
            if (_.size(selectedBuildings) > 0) {
                this.leftpanel.show(this.ChartArea);
            } else {
                this.leftpanel.show(this.instructionView);
            }

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
