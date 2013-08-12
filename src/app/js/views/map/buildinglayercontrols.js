define([
    "backbone.marionette",
    "hbs!./buildinglayercontrols.tmpl"
    ], 
    function(Marionette, tmpl) {
        return Marionette.ItemView.extend({
            template: {
                template: tmpl,
                type: 'handlebars'
            },
            events: {
                "click .btn": "click"
            },
            onShow: function() {
                this.delegateEvents();
            },
            click: function() {
                var btn = this.$(".btn");
                if (btn.hasClass("active")) {
                    btn.removeClass("active");
                    this.trigger("deactivate");
                } else {
                    btn.addClass("active");
                    this.trigger("activate");
                }
            }
        });
});
