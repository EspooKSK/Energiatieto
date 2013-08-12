define([
    "backbone.marionette",
    "hbs!./welcomeview.tmpl",
    "bootstrap",
    ], function(Marionette, tmpl, bootstrap) {
        return Marionette.ItemView.extend({
            template: {
                template: tmpl,
                type: "handlebars"
            },
            onShow: function() {
                this.$('#welcome-modal').modal();
            }
        });
});
