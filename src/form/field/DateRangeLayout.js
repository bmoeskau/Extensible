/**
 * @class Extensible.form.field.DateRangeLayout
 * @extends Ext.layout.container.Container
 * @markdown
 * @private
 */
Ext.define('Extensible.form.field.DateRangeLayout', {
    extend: 'Ext.layout.container.Container',
    alias: ['layout.extensible.daterange'],
    
    onLayout: function() {
        var me = this,
            shadowCt = me.getShadowCt(),
            owner = me.owner,
            singleLine = owner.isSingleLine(),
            items = owner.items.items,
            numItems = items.length,
            i = 0,
            item;
        
        if (singleLine) {
            for (; i < numItems; i++) {
                item = items[0];
                shadowCt.getComponent('row1').add(item);
            }
        }
        else {
            shadowCt.getComponent('row1').add(owner.startDate, owner.startTime, owner.toLabel);
            shadowCt.getComponent('row2').add(owner.endDate, owner.endTime, owner.allDay);
        }
        
        if (!shadowCt.rendered) {
            shadowCt.render(me.getRenderTarget());
        }

        shadowCt.doComponentLayout();
        owner.setHeight(shadowCt.getHeight()-5);
    },

    /**
     * @private
     * Creates and returns the shadow vbox container that will be used to arrange the owner's items
     */
    getShadowCt: function() {
        var me = this,
            items = [];

        if (!me.shadowCt) {
            me.shadowCt = Ext.createWidget('container', {
                layout: 'auto',
                anchor: '100%',
                ownerCt: me.owner,
                items: [{
                    xtype: 'container',
                    itemId: 'row1',
                    layout: 'hbox',
                    defaults:{
                        margins:'0 5 0 0'
                    }
                },{
                    xtype: 'container',
                    itemId: 'row2',
                    layout: 'hbox',
                    defaults:{
                        margins:'0 5 0 0'
                    }
                }]
            });
        }
        
        return me.shadowCt;
    },
    
    // We don't want to render any items to the owner directly, that gets handled by each column's own layout
    renderItems: Ext.emptyFn
});