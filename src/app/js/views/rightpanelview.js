define([
    "backbone.marionette",
    "hbs!./rightpanelview.tmpl",
    "./form/buildinginfoform",
    "./form/solarpanelform",
    "./form/geothermalwellform",
    "./form/purchasedform",
    "../models/selectedbuildings",
    "../models/solarpanelproducers",
    "../models/geothermalwellproducers",
    "./map/mapview",
    "../models/mapposition",
    "./controlformcollectionview",
    "./navigationview",
    ], function(Marionette, 
                tmpl, 
                BuildingInfoForm,
                SolarPanelForm,
                GeothermalWellForm,
                PurchasedForm,
                SelectedBuildings,
                SolarPanelProducers,
                GeothermalWellProducers,
                MapView,
                MapPosition,
                ControlFormCollectionView,
                NavigationView) {

      var viewTypes = {
        "building-info" : BuildingInfoForm,
        "solarpanels"    : SolarPanelForm,
        "geothermalwells"    : GeothermalWellForm,
        "purchased"     : PurchasedForm
      };

        return Marionette.Layout.extend({
            template: {
                template: tmpl,
                type: "handlebars"
            },
            regions: {
                navigation  : '.navigation',
                form        : '.control-form',
                map         : '.map-container'
            },
            events: {
                "click .search-btn": "submitSearchForm"
            },
            initialize: function(){
                _.bindAll(this);

                var self       = this,
                    buildings  = this.buildings  = SelectedBuildings,
                    solarpanelproducers = this.solarpanelproducers = SolarPanelProducers,
                    geothermalwellproducers = this.geothermalwellproducers = GeothermalWellProducers;

                this.solarpanelproducers.attachTo(this.model, "solarpanelproducers");
                this.geothermalwellproducers.attachTo(this.model, "geothermalwellproducers");
                this.buildings.attachTo(this.model, "buildings");

                this.navigationView = new NavigationView()
                  .on('showConsumption', self.showConsumption)
                  .on('showSolarProduction', self.showSolarProduction)
                  .on('showGeoProduction', self.showGeoProduction);

                this.mapView = new MapView({
                    buildings: buildings,
                    solarpanelproducers: solarpanelproducers,
                    geothermalwellproducers: geothermalwellproducers,
                    model: new MapPosition({
                        id: 'map-view-pos'
                    })
                });
              
                this.buildingsFormCollectionView = new ControlFormCollectionView(
                    { collection: SelectedBuildings, itemView: BuildingInfoForm });
                this.solarPanelsFormCollectionView = new ControlFormCollectionView(
                    { collection: SolarPanelProducers, itemView: SolarPanelForm });
                this.geothermalWellsFormCollectionView = new ControlFormCollectionView(
                    { collection: GeothermalWellProducers, itemView: GeothermalWellForm });
              
                this.displayedCollectionView = this.buildingsFormCollectionView;

                this.buildings.on('add', self.buildingsFormCollectionView.render);
                this.solarpanelproducers.on('add', self.solarPanelsFormCollectionView.render);
                this.geothermalwellproducers.on('add', self.geothermalWellsFormCollectionView.render);

                this.buildings.on('reset', self.buildingsFormCollectionView.render);
                this.solarpanelproducers.on('reset', self.solarPanelsFormCollectionView.render);
                this.geothermalwellproducers.on('reset', self.geothermalWellsFormCollectionView.render);
            },
            onShow: function() {
                this.navigation.show(this.navigationView);
                this.map.show(this.mapView);
              
                this.showConsumption();
                this.loadBuildingsAndProducersFromStorage();

            },
            loadBuildingsAndProducersFromStorage: function(){
                this.solarpanelproducers.fetch();
                this.geothermalwellproducers.fetch();
                this.buildings.fetch();
            },
            showConsumption: function(){
                this.$(".search").show();
                this.form.show(this.buildingsFormCollectionView);
                this.mapView.showBuildings();
            },
            showSolarProduction: function(){
                this.$(".search").hide();
                this.form.show(this.solarPanelsFormCollectionView);
                this.mapView.showSolarEnergy();
            },
            showGeoProduction: function(){
                this.$(".search").hide();
                this.form.show(this.geothermalWellsFormCollectionView);
                this.mapView.showGeoEnergy();
            },
            submitSearchForm: function(event) {
                var address = this.$("input[name=search]").val();
                this.mapView.trigger("search", address);
                return false;
            },
            clearAllMapObjects: function() {
              SolarPanelProducers.reset();
              GeothermalWellProducers.reset();
              SelectedBuildings.reset();
              localStorage.clear();
            },
        });
});
