define([
    "backbone.marionette",
    "hbs!./solarmapcontrols.tmpl"
    ], 
    function(Marionette, tmpl) {
        return Marionette.ItemView.extend({
            events: {
                "click .btn"        : "clickBtn"
            },
            clickBtn: function(event) {
                var btn = this.$(".btn");
                if (btn.hasClass("active")) {
                    btn.removeClass("active");
                    this.trigger("deactivate");
                } else {
                    btn.addClass("active");
                    this.trigger("activate");
                }
            },
            onShow: function() {
                this.delegateEvents();
            },
            template: {
                template: tmpl,
                type: 'handlebars'
            },
            setText: function(text) {
                this.$(".text").text(text);
            }
        });
});
