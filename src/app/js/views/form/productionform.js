define([
    "backbone.marionette",
    "hbs!./productionform.tmpl",
    "backbone.modelbinder",
    "../../helpers/helptextvent",
    "text!../helptexts/production.txt",
    "jquery-ui",
    "../../models/energyproducers"
    ], function(Marionette, tmpl, ModelBinder, HelpTextVent, HelpText, jqueryUi, EnergyProducers) {

        return Marionette.ItemView.extend({
            template: {
                template: tmpl,
                type: "handlebars"
            },
            templateHelpers: {
                typeName: function() {
                    if (this.type === "solarpanel") {
                        return ("Aurinkokeräin : " + this.solarInstallationName);
                    } else {
                        return ("Lämpökaivo : " + this.boreholeName);
                    }
                },
                typeIsSolar: function() {
                  return ( this.type === 'solarpanel' );
                },
                typeIsGeothermal: function() {
                  return ( this.type === 'geothermal' );
                },
                showSolarInstallationDataIsTrue: function() {
                    return ( this.showSolarInstallationData === true );
                },
                roofArea: function() {
                    return Number(this.roofArea);
                },
                isSelected: function() {
                    var selectedObj = EnergyProducers.getSelected();
                    return selectedObj && (this.id === selectedObj.id);
                }
            },
            events: {
                "click .delete": "destroyModel",
                "click .toggle-show-details-btn": "toggleBackgroundData"
            },
            modelEvents: {
                "change": "modelChanged",
                "selected": "render",
                "deselect": "render"
            },
            destroyModel: function() {
                this.model.destroy();
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
            onShow: function() {
                HelpTextVent.trigger("change", HelpText);
            },
            onRender: function() {
                var self = this;
              
                var bindings = ModelBinder.createDefaultBindings(self.el, 'name');

                if(self.model.get('type') === 'solarpanel'){
                  initializeAreaSliders();
                  addSliderBindings(bindings);
                }

                this.modelBinder.bind(this.model, this.el, bindings);

                this.$('.background-details').hide();

                return bindings;

                function initializeAreaSliders(){
                  self.$( "#photovoltaicAreaSlider" ).slider({
                    min: 0,
                    max: self.model.attributes.roofArea,
                    slide: function (event, ui){
                      var value = ui.value;
                      self.model.set('photovoltaicArea', value);
                    }
                  });

                  self.$( "#thermalAreaSlider" ).slider({
                    min: 0,
                    max: self.model.attributes.roofArea,
                    slide: function (event, ui){
                      var value = ui.value;
                      self.model.set('thermalArea', value);
                    }
                  });
                }

                function addSliderBindings(bindings){
                    bindings.photovoltaicArea = { selector: '[name="photovoltaicArea"]',
                                                  converter: function(direction, value, attr, model, els){
                                                    self.$( "#photovoltaicAreaSlider" ).slider( "value", value );
                                                    return value;
                                                  }};
                    bindings.thermalArea = { selector: '[name="thermalArea"]',
                                             converter: function(direction, value, attr, model, els){
                                               self.$( "#thermalAreaSlider" ).slider( "value", value );
                                               return value;
                                             }};
                    return bindings;
                }
            },
            onClose: function() {
                this.modelBinder.unbind();
            }
        });
});
