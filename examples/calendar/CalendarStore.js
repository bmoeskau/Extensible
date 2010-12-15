/*
 * A simple reusable store that loads static calendar field definitions into memory
 * and can be bound to the CalendarCombo widget and used for calendar color selection.
 */
Ext.ensible.sample.CalendarStore = Ext.extend(Ext.data.Store, {
    constructor: function(config){
        config = Ext.applyIf(config || {}, {
            storeId: 'calendarStore',
            root: 'calendars',
            idProperty: Ext.ensible.cal.CalendarMappings.CalendarId.mapping || 'id',
            proxy: new Ext.data.MemoryProxy(),
            autoLoad: true,
            fields: Ext.ensible.cal.CalendarRecord.prototype.fields.getRange(),
            sortInfo: {
                field: Ext.ensible.cal.CalendarMappings.Title.name,
                direction: 'ASC'
            }
        });
        this.reader = new Ext.data.JsonReader(config);
        Ext.ensible.sample.CalendarStore.superclass.constructor.call(this, config);
    }
});