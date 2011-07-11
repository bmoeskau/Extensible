/**
 * @class Extensible.layout.container.DateRange
 * @extends Ext.layout.container.Container
 * @markdown
 */
Ext.define('Extensible.layout.container.DateRange', {
    extend: 'Ext.layout.container.Container',
    alias: ['layout.extensible.daterange'],

    onLayout: function() {
        var owner = this.owner,
            items = owner.items,
            numItems = items.length;
        
        if (owner.isSingleLine()) {
        
        }
        else {
        
        }
    },

    // We don't want to render any items to the owner directly, that gets handled by each column's own layout
    renderItems: Ext.emptyFn
});