define([
        "backbone",
        "backbone.marionette", 
        "bootstrap",
        "hbs!./mainview.tmpl",
        "hbs!./clearconfirmation.tmpl",
        "./form/buildinginfoform",
        "./form/productionform",
        "./form/purchasedform",
        "../models/selectedbuildings",
        "../models/energyproducers",
        "./chartareaview",
        "../models/chartareamodel",
        "./helptext",
        "./map/mapview",
        "../models/mapposition",
        "../helpers/helptextvent",
        "./welcomeview",
        "./controlformcollectionview",

        "text!./helptexts/buildinginfo.txt",
        "text!./helptexts/production.txt"
    ], 
    function(
        Backbone,
        Marionette, 
        bootstrap,
        tmpl,
        clearconfirmationtmpl,
        BuildingInfoForm,
        ProductionForm,
        PurchasedForm,
        SelectedBuildings,
        EnergyProducers,
        ChartAreaView,
        ChartAreaModel,
        HelpTextView,
        MapView,
        MapPosition,
        HelpText,
        WelcomeView,
        ControlFormCollectionView,
        BuildingHelpText,
        ProductionHelpText
    ) {

    var viewTypes = {
        "building-info" : BuildingInfoForm,
        "production"    : ProductionForm,
        "purchased"     : PurchasedForm
    };

    var MainView = Marionette.Layout.extend({
        className: 'master',
        template: {
            type: 'handlebars',
            template: tmpl
        },
        regions: {
            form        : '.control-form',
            charts      : '.chart-area',
            map         : '.map',
            helptext    : '.helptext',
            welcome     : '#welcome-view'
        },
        events: {
          "click #welcome-link": "displayWelcomeDialog"
        },
        initialize: function(options) {
            _.bindAll(this);
            
            var self       = this,
                buildings  = this.buildings  = SelectedBuildings,
                chartModel = this.chartModel = new ChartAreaModel(options.model),
                producers  = this.producers  = EnergyProducers;

            this.producers.attachTo(this.model, "producers");
            this.buildings.attachTo(this.model, "buildings");

            this.ChartArea = new ChartAreaView({
                model: chartModel
            }).on("select", function(view) {
                if (view === "production") {
                    self.showProductionForm();
                } else {
                    self.showBuildingInfoForm();
                }
                self.selectMapView(view);
            });

            this.mapView = new MapView({
                buildings: buildings,
                producers: producers,
                model: new MapPosition({
                    id: 'map-view-pos'
                })
            });

            this.buildingsFormCollectionView = new ControlFormCollectionView({ collection: SelectedBuildings, itemView: BuildingInfoForm });
            this.procudersFormCollectionView = new ControlFormCollectionView({ collection: EnergyProducers, itemView: ProductionForm });
        },
        showBuildingInfoForm: function() {
            HelpText.trigger("change", BuildingHelpText);
            this.form.show(this.buildingsFormCollectionView);
        },
        showProductionForm: function() {
            HelpText.trigger("change", ProductionHelpText);
            this.form.show(this.procudersFormCollectionView);
        },
        selectMapView: function(view) {
            if(view === "production") {
                this.mapView.showSolarAndGeoEnergy();
            } else {
                this.mapView.showOnlyBuildingLayer();
            }
        },
        onShow: function() {
            this.map.show(this.mapView);
            this.charts.show(this.ChartArea);
            this.helptext.show(new HelpTextView({
                model: new Backbone.Model()
            }));
            this.showBuildingInfoForm();
            
            this.producers.fetch();
            this.buildings.fetch();
            this.initClearConfirmationPopover();
        },
        displayWelcomeDialog: function() {
            this.welcome.show(new WelcomeView());
        },
        initClearConfirmationPopover: function() {
            var self = this;
            this.$('#clearAllMapObjectsButton').popover({
                placement: 'bottom',
                title: 'Oletko varma?',
                html: true,
                content: clearconfirmationtmpl
            }).click(function(event) {
                var popoverTarget = $(event.target);
                $('.popover-content #confirmClearAllMapObjectsButton').click(function() {
                    self.clearAllMapObjects();
                    popoverTarget.popover('hide');
                });
                $('.popover-content .cancel').click(function() {
                    popoverTarget.popover('hide');
                })

            });
        },
        clearAllMapObjects: function() {
            EnergyProducers.reset();
            SelectedBuildings.reset();
            localStorage.clear();
        }
    });
    return MainView;
});
