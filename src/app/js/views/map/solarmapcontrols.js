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
            initialize: function() {
                this.isSolar = true;
            },
            onShow: function() {
                this.delegateEvents();
            },
            template: {
                template: tmpl,
                type: 'handlebars'
            },
            setSolar: function() {
                this.isSolar = true;
                this.render();
            },
            setGeo: function() {
                this.isSolar = false;
                this.render();
            },
            serializeData: function(){
                return {
                  isSolar: this.isSolar
                };
            }
        });
});
