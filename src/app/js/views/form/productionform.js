define([
    "backbone.marionette",
    "hbs!./productionform.tmpl",
    "backbone.modelbinder",
    "../../helpers/helptextvent",
    "text!../helptexts/production.txt",
    "jquery-ui"
    ], function(Marionette, tmpl, ModelBinder, HelpTextVent, HelpText, jqueryUi) {
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
                showBoreholeDataIsTrue: function() {
                    return ( this.showBoreholeData === true );
                },
                roofArea: function() {
                    return Number(this.roofArea);
                }
            },
            events: {
                "click .delete": "destroyModel"
            },
            modelEvents: {
                "change": "modelChanged"
            },
            destroyModel: function() {
                this.model.destroy();
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
                console.log('this.model:', this.model);
                console.log('this.model.roofArea:', this.model.roofArea);
                console.log('this.model.attributes.roofArea:', this.model.attributes.roofArea);

                function onPhotovoltaicAreaSliderSlide(event, ui){
                  console.log('event:', event);
                  console.log('ui:', ui);
                  var value = ui.value;
                  self.model.set('photovoltaicArea', value);
                }

                function onThermalAreaSliderSlide(event, ui){
                  console.log('event:', event);
                  console.log('ui:', ui);
                  var value = ui.value;
                  self.model.set('thermalArea', value);
                }

                this.$( "#photovoltaicAreaSlider" ).slider({
                  min: 0,
                  max: this.model.attributes.roofArea,
                  slide: onPhotovoltaicAreaSliderSlide
                });
                this.$( "#thermalAreaSlider" ).slider({
                  min: 0,
                  max: this.model.attributes.roofArea,
                  slide: onThermalAreaSliderSlide
                });
                var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
                bindings.photovoltaicArea = { selector: '[name=photovoltaicArea]',
                                              converter: function(direction, value, attr, model, els){
                                                self.$( "#photovoltaicAreaSlider" ).slider( "value", value );
                                                return value;
                                              }};
                bindings.thermalArea = { selector: '[name=thermalArea]',
                                         converter: function(direction, value, attr, model, els){
                                           self.$( "#thermalAreaSlider" ).slider( "value", value );
                                           return value;
                                         }};
                this.modelBinder.bind(this.model, this.el, bindings);
                console.log('this.model:', this.model);
                console.log('this.el:', this.el);
                console.log('bindings:', bindings);
            },
            onClose: function() {
                this.modelBinder.unbind();
            }
        });
});
