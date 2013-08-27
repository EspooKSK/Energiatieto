define([
        "underscore",
        "jquery",
        "backbone",
        "backbone.marionette", 
        "hbs!./mapview.tmpl",
        "../../helpers/googlemaps",
        "./mapstyles",
        "./buildinglayer",
        "./energylayer"
    ], function(
        _,
        $,
        Backbone,
        Marionette,
        tmpl,
        GoogleMaps,
        MapStyles,
        BuildingLayer,
        EnergyLayer) {

        return Marionette.Layout.extend({
            template: {
                template: tmpl,
                type: "handlebars"
            },
            regions: {
                controls: ".controls",
            },
            layers: {
            },
            activate: function(layer) {
                this.clear();
                if (typeof layer.activate === "function") {
                    layer.activate();
                }
                if (typeof layer.controls !== "undefined") {
                    this.controls.show(layer.controls);
                }
            },
            showBuildings: function() {
                this.clear();
                this.activate(this.layers.building);
            },
            clear: function() {
                this.controls.close();
                    this.map.overlayMapTypes.clear();
                    _.each(_.values(this.layers), function(it) {
                        if (typeof it.deactivate === "function") {
                            it.deactivate();
                        }
                });
            },
            showSolarEnergy: function() {
                this.activate(this.layers.energy);
                this.layers.energy.selectSolarEnergy();
            },
            showGeoEnergy: function() {
                this.activate(this.layers.energy);
                this.layers.energy.selectGeoEnergy();
            },
            initialize: function(options) {
                _.bindAll(this);
                var self = this;
                this.buildings = options.buildings;
                this.solarpanelproducers = options.solarpanelproducers;
                this.geothermalwellproducers = options.geothermalwellproducers;
            },
            createMap: function() {
                var self = this;
                this.map = new google.maps.Map($("<div class='google-map'/>")[0], MapStyles.options());
                this.bindTo(this, "search", function(address) {
                    new google.maps.Geocoder().geocode({
                            address: address,
                            bounds: self.map.getBounds()
                        },
                        function(res, status) {
                            if (status === "OK") {
                                self.map.panTo(res[0].geometry.location);
                                self.map.setZoom(MapStyles.options().maxZoom);
                            }
                        });
                });

                this.model.fetch({
                    success: function(model) {
                        if (model.has("center")) {
                            var center = model.get("center");
                            self.map.setCenter(new google.maps.LatLng(center.lat, center.lng));
                        }
                        if (model.has("zoom")) {
                            self.map.setZoom(model.get("zoom"));
                        }
                    }
                });

                google.maps.event.addListener(this.map, 'center_changed', function() {
                    var center = self.map.getCenter();
                    self.model.set({
                        center: {
                            lat: center.lat(),
                            lng: center.lng()
                        }
                    });                    
                });
                google.maps.event.addListener(this.map, 'zoom_changed', function() {
                    self.model.set({
                        zoom: self.map.getZoom()
                    });
                });

            },
            search: function(){
            },
            onShow: function() {
                var self = this;
                GoogleMaps.create(function() {
                    if (!self.googleCreated) {
                        self.createMap();
                        self.layers = self.newLayers();
                        self.showBuildings();
                        self.googleCreated = true;
                    }
                    self.$(".map").append(self.map.getDiv());
                });
            },
            newLayers: function() {
                var buildingLayer = new BuildingLayer(this.map, this.buildings);
                var energyLayer = new EnergyLayer(
                            this.map, 
                            this.solarpanelproducers, 
                            this.geothermalwellproducers, 
                            buildingLayer);

                return {
                    building    : buildingLayer,
                    energy      : energyLayer
                };
            },
            onHide: function() {
                this.$(".map").children().detach();
            }
        });
});
