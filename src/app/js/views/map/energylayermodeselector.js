define([
    "backbone.marionette",
    "hbs!./energylayermodeselector.tmpl"
    ], 
    function(Marionette, tmpl) {
        return Marionette.ItemView.extend({
            template: {
                template: tmpl,
                type: "handlebars"
            },
            events: {
                "click .solar": "solar",
                "click .geoenergy": "geoenergy"
            },
            solar: function() {
                this.$(".geoenergy").removeClass("active");
                this.$(".solar").addClass("active");
                this.trigger("solar");
            },
            onShow: function() {
                this.delegateEvents();
            },
            geoenergy: function() {
                this.$(".geoenergy").addClass("active");
                this.$(".solar").removeClass("active");
                this.trigger("geoenergy");
            }
        });
    }
);
