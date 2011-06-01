/*
 * A simple reusable store that loads static calendar field definitions into memory
 * and can be bound to the CalendarCombo widget and used for calendar color selection.
 */
Ext.define('Ext.ensible.sample.CalendarStore', {
    extend: 'Ext.data.Store',
    model: 'Ext.ensible.cal.CalendarRecord',
    
    constructor: function(config){
        config = Ext.applyIf(config || {}, {
            storeId: 'calendarStore',
            root: 'calendars',
            model: this.model,
            idProperty: Ext.ensible.cal.CalendarMappings.CalendarId.mapping || 'id',
            proxy: new Ext.data.MemoryProxy(),
            autoLoad: true,
            fields: Ext.ensible.cal.CalendarRecord.prototype.fields.getRange(),
            sorters: [{
                property: Ext.ensible.cal.CalendarMappings.Title.name,
                direction: 'ASC'
            }]
        });
        this.reader = new Ext.data.JsonReader(config);
        this.callParent(arguments);
    }
});