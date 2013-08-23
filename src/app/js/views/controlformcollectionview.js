define([
    "backbone.marionette" 
    ], function(Marionette) {

        return Marionette.CollectionView.extend({
            events: {
                "click .toggle-show-details-btn": "toggleBackgroundData",
                "click .accordion-toggle": "toggleAccordionItemChevron"
            },
            toggleAccordionItemChevron: function(event) {
                this.$(event.target).closest('.accordion-toggle').find('.accordion-icon').toggleClass('icon-chevron-down').toggleClass('icon-chevron-up');
            },
            toggleBackgroundData: function(event) {
                var target = this.$(event.target);
                target.find('.toggle-show-details-icon').toggleClass('icon-chevron-down').toggleClass('icon-chevron-up');
                target.closest('.accordion-group').find('.background-details').slideToggle();
            },
            onItemAdded: function(itemView) {
                itemView.on("delete", this.removeItemFn(itemView));
            },
            removeItemFn: function(itemView) {
                var self = this;
                return function() {
                    itemView.model.destroy();
                };
            },
            onItemRemoved: function(itemView) {
                itemView.off("delete");
            },
            appendHtml: function(collectionView, itemView, index) {
                collectionView.$el.prepend(itemView.el);
            }
        }); 
});
