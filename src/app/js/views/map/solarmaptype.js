define([
    "./mapstyles",
    "./solarmapcontrols"
    ], function(MapStyles, SolarMapControls) {

        return function(map) {
            var type = new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                    var bound = Math.pow(2, zoom);
                  
                    var baseUrl = "https://espoo-energiatieto-maps.s3.amazonaws.com/solarMapTiles/";
                    var url = baseUrl + zoom + "/" + coord.x + "/" + (bound - coord.y - 1) + ".png";
                    return url;
                },
                tileSize: new google.maps.Size(256, 256),
                maxZoom: 20,
                minZoom: 8,
                name: "Solar",
                opacity: 1.0
            });

            type.activate = function() {
                map.overlayMapTypes.push(this);
            };

            type.controls = new SolarMapControls({
                
            });

            return type;
        };
    });
