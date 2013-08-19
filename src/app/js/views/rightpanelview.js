define([
    "backbone.marionette",
    "hbs!./rightpanelview.tmpl",
    "./map/mapview",
    ], function(Marionette, tmpl, MapView) {
        return Marionette.ItemView.extend({
            template: {
                template: tmpl,
                type: "handlebars"
            },
            initialize: function(){
                _.bindAll(this);
            },
            events: {
                "submit form.search": "submitSearchForm"
            },
            submitSearchForm: function(event) {
                //this.trigger("search", this.$("input[name=search]").val());
                var address = this.$("input[name=search]").val();
                //this.mapview.search(address);
                return false;
            },
        });
});
