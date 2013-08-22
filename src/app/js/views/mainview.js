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
        "./navigationview",
        "./rightpanelview",

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
        NavigationView,
        RightPanelView,

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
            rightpanel  : '.map-panel',
            navigation  : '.navigation',
            form        : '.control-form',
            charts      : '.chart-area',
            map         : '.map-container',
            helptext    : '.helptext',
            welcome     : '.welcome-view'
        },
        events: {
          "click #welcome-link": "displayWelcomeDialog",
          "click .search-btn": "submitSearchForm"
        },
        initialize: function(options) {
            _.bindAll(this);
            
            var self       = this,
                buildings  = this.buildings  = SelectedBuildings,
                chartModel = this.chartModel = new ChartAreaModel(options.model),
                producers  = this.producers  = EnergyProducers;

            this.producers.attachTo(this.model, "producers");
            this.buildings.attachTo(this.model, "buildings");
          
            this.rightPanelView = new RightPanelView();
            this.navigationView = new NavigationView()
              .on('showConsumption', self.showConsumption)
              .on('showSolarProduction', self.showSolarProduction)
              .on('showGeoProduction', self.showGeoProduction);
          

            this.ChartArea = new ChartAreaView({
                model: chartModel
            });

            this.mapView = new MapView({
                buildings: buildings,
                producers: producers,
                model: new MapPosition({
                    id: 'map-view-pos'
                })
            });

            this.buildingsFormCollectionView = new ControlFormCollectionView({ collection: SelectedBuildings, itemView: BuildingInfoForm });
            this.producersFormCollectionView = new ControlFormCollectionView({ collection: EnergyProducers, itemView: ProductionForm });
        },
        showConsumption: function(){
            this.showBuildingInfoForm();
            this.mapView.showOnlyBuildingLayer();
        },
        showSolarProduction: function(){
            this.showProductionForm();
            this.mapView.showSolarEnergy();
        },
        showGeoProduction: function(){
            this.showProductionForm();
            this.mapView.showGeoEnergy();
        },
        showBuildingInfoForm: function() {
            HelpText.trigger("change", BuildingHelpText);
            this.form.show(this.buildingsFormCollectionView);
        },
        showProductionForm: function() {
            HelpText.trigger("change", ProductionHelpText);
            this.form.show(this.producersFormCollectionView);
        },
        onShow: function() {
            this.rightpanel.show(this.rightPanelView);
            this.navigation.show(this.navigationView);
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
            var clearButton = this.$('#clearAllMapObjectsButton');
            clearButton.popover({
                placement: 'bottom',
                title: 'Oletko varma?',
                html: true,
                content: clearconfirmationtmpl
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
            EnergyProducers.reset();
            SelectedBuildings.reset();
            localStorage.clear();
        },
        submitSearchForm: function(event) {
          var address = this.$("input[name=search]").val();
          this.mapView.trigger("search", address);
          return false;
        },
    });
    return MainView;
});
