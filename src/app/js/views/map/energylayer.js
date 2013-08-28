define([
    "underscore",
    "./markerstore",
    "./solarmaptype",
    "./geoenergymaptype",
    "./solarmapcontrols",
    "../../models/solarpanel",
    "../../models/geothermalwell"
    ], function(
        _,
        MarkerStore,
        SolarMapType,
        GeoEnergyMapType,
        SolarMapControls,
        SolarPanel,
        GeoThermalWell) {

        return function(map, solarPanelCollection, geothermalWellCollection, buildingLayer) {
            var self = this;

            var geoEnergyOverlay = new GeoEnergyMapType(map);

            this.controls = new SolarMapControls();
            this.markerStore = new MarkerStore();

            _.bindAll(this);

            this.controls.on("deactivate", function() {
                google.maps.event.removeListener(self.listener);
            });

            this.onclick = function() {};

            this.clickHandler = function() {
                self.onclick.apply(self, arguments);
            };

            this.activateSolar = function() {
                solarPanelCollection.on("reset", self.initSolarMarkers);
                solarPanelCollection.on("add", self.addMarker);

                self.markerStore.associateWith(map);

                this.initSolarMarkers();
            };

            this.initSolarMarkers = function() {
                self.markerStore.clear();
                solarPanelCollection.each(self.addMarker);
            };

            this.activateGeo = function() {
                geothermalWellCollection.on("reset", self.initGeoMarkers);
                geothermalWellCollection.on("add", self.addMarker);

                self.markerStore.associateWith(map);

                this.initGeoMarkers();
            };

            this.initGeoMarkers = function() {
                self.markerStore.clear();
                geothermalWellCollection.each(self.addMarker);
            };

            this.addMarker = function(producer) {
                var loc = producer.get("loc"),
                    marker = self.markerStore.create({
                        position: new google.maps.LatLng(loc.lat, loc.lng),
                        map: map,
                        iconBaseUrl: producer.get("iconBaseUrl")
                });

                marker.onclick(function() {
                    if(producer.get('type') === 'solarpanel'){
                      solarPanelCollection.trigger("select", producer);
                    }
                    if(producer.get('type') === 'geothermal'){
                      geothermalWellCollection.trigger("select", producer);
                    }
                });

                producer.on("deselect", marker.deactivate);
                producer.on("selected", marker.activate);
                producer.on("destroy", marker.remove);

                if (producer.get("___selected")) {
                    marker.activate();
                }
            };

            this.addSolarPanel = function(event) {
                var loc = event.latLng;
                var panel = new SolarPanel({
                  averageRadiation: event.row.AvActKWHm2.value,
                  loc: {
                    lat: loc.lat(),
                    lng: loc.lng()
                  }
                });

                _.each(_.keys(panel.defaults), function(key) {
                    var capKey = key.charAt(0).toUpperCase() + key.substring(1);
                    if (event.row[capKey]) {
                        panel.set(key, parseFloat(event.row[capKey].value));
                    }
                });
                
                solarPanelCollection.add(panel);
                solarPanelCollection.trigger("select", panel);
            };

            this.selectSolarEnergy = function() {
                self.replaceOverlay(new SolarMapType(map));

                self.activateSolar();
                self.onclick = self.addSolarPanel;
                self.controls.off("activate");
                self.controls.on("activate", function() {
                    self.listener = google.maps.event.addListener(buildingLayer, 'click', self.clickHandler);
                });
                buildingLayer.setOptions({
                    clickable: true
                });
                self.controls.setSolar();
            };

            this.replaceOverlay = function(overlayType) {
                map.overlayMapTypes.clear();
                map.overlayMapTypes.push(overlayType);
            };

            this.addGeoThermalWell = function(event) {
                geoEnergyOverlay.getData(event.latLng, function(data) {
                    var loc = event.latLng,
                        well = new GeoThermalWell({
                                loc: {
                                    lat: loc.lat(),
                                    lng: loc.lng()
                                }
                            });
                        if (data.type) {
                            well.set({
                                "bedrockType": data.type,
                                "bedrockTypeId": data.typeid
                            });
                        }

                    geothermalWellCollection.add(well);
                    geothermalWellCollection.trigger("select", well);
                });
            };

            this.selectGeoEnergy = function() {
                self.replaceOverlay(geoEnergyOverlay);

                buildingLayer.setOptions({
                    clickable: false
                });
                self.activateGeo();
                self.onclick = self.addGeoThermalWell;
                self.controls.off("activate");
                self.controls.on("activate", function() {
                    self.listener = google.maps.event.addListener(map, 'click', self.clickHandler);
                });
                self.controls.setGeo();
            };

            this.deactivate = function() {
                google.maps.event.removeListener(self.listener);
                buildingLayer.setOptions({
                    clickable: true
                });
                self.markerStore.disassociate();
                solarPanelCollection.off("reset", self.initSolarMarkers);
                solarPanelCollection.off("add", self.addMarker);
                geothermalWellCollection.off("reset", self.initSolarMarkers);
                geothermalWellCollection.off("add", self.addMarker);
            };
        };
});
