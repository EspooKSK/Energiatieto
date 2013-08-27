define([
    "backbone.marionette" 
    ], function(Marionette) {
      
        return Marionette.CollectionView.extend({
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
                if(itemView) itemView.off("delete");
            },
            appendHtml: function(collectionView, itemView, index) {
                collectionView.$el.prepend(itemView.el);
            }
        }); 
});
