define([
    "backbone.marionette",
    "hbs!./geothermalwellform.tmpl",
    "backbone.modelbinder",
    "jquery-ui",
    "../../models/geothermalwellproducers"
    ], function(Marionette, tmpl, ModelBinder, jqueryUi, GeothermalWellProducers) {

        return Marionette.ItemView.extend({
            template: {
                template: tmpl,
                type: "handlebars"
            },
            templateHelpers: {
                typeName: function(){
                    return ("Lämpökaivo : " + this.boreholeName);
                },
                isSelected: function() {
                    var selectedObj = GeothermalWellProducers.getSelected();
                    return selectedObj && (this.id === selectedObj.id);
                }
            },
            events: {
                "click .delete": "destroyModel",
                "click .toggle-show-details-btn": "toggleBackgroundData",
                "click .accordion-toggle": "toggleAccordionItem"
            },
            modelEvents: {
                "change": "modelChanged",
                "selected": "render",
                "deselect": "render"
            },
            destroyModel: function() {
                this.model.destroy();
                this.close();
            },
            toggleAccordionItem: function() {
                this.$('.accordion-toggle > i').toggleClass('icon-chevron-down').toggleClass('icon-chevron-up');
            },
            toggleBackgroundData: function() {
                this.$('.toggle-show-details-icon').toggleClass('icon-chevron-down').toggleClass('icon-chevron-up');
                this.$('.background-details').slideToggle();
            },
            // re-renders the form if element bound to changed property has class ".re-render"
            modelChanged: function(model, event) {
                var self = this;
                _.each(_.keys(event.changes), function(it) {
                    var selector = ".re-render[name="+it+"]";
                    if (self.$(selector).length) {
                        self.render();
                        // re-select the element from the now changed form and focus on it
                        self.$(selector).each(function() { this.focus(); });
                    }
                });
            },
            initialize: function(options) {
                _.bindAll(this);
                this.modelBinder = new ModelBinder();
            },
            onRender: function() {
                var self = this;
              
                var bindings = ModelBinder.createDefaultBindings(self.el, 'name');

                this.modelBinder.bind(this.model, this.el, bindings);

                this.$('.background-details').hide();

                return bindings;
            },
            onClose: function() {
                this.modelBinder.unbind();
            }
        });
});
