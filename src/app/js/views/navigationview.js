define([
    "backbone.marionette",
    "hbs!./navigationview.tmpl",
    ], function(Marionette, tmpl, bootstrap) {
        return Marionette.ItemView.extend({
            template: {
                template: tmpl,
                type: "handlebars"
            },
            events: {
                "click #consumption-nav-btn": "onConsumptionClick",
                "click #solar-nav-btn": "onSolarClick",
                "click #geo-nav-btn": "onGeoClick"
            },
            initialize: function(){
                _.bindAll(this);
            },
            onConsumptionClick: function(){
                this.trigger('showConsumption');
                this.$("#consumption-nav-btn").addClass("active");
                this.$("#solar-nav-btn").removeClass("active");
                this.$("#geo-nav-btn").removeClass("active");
            },
            onSolarClick: function(){
                this.trigger('showSolarProduction');
                this.$("#consumption-nav-btn").removeClass("active");
                this.$("#solar-nav-btn").addClass("active");
                this.$("#geo-nav-btn").removeClass("active");
            },
            onGeoClick: function(){
                this.trigger('showGeoProduction');
                this.$("#consumption-nav-btn").removeClass("active");
                this.$("#solar-nav-btn").removeClass("active");
                this.$("#geo-nav-btn").addClass("active");
            }
        });
});
