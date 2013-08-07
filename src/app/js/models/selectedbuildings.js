define(["./selectablecollection", "./buildinginfomodel"], 
    function(SelectableCollection, Building) {
    // this is a singleton, so that it can be accessed in test cases
    return new (SelectableCollection.extend({
        model: Building
    }))();
});
