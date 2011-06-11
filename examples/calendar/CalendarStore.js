/*
 * A simple reusable store that loads static calendar field definitions into memory
 * and can be bound to the CalendarCombo widget and used for calendar color selection.
 */
Ext.define('Ext.ensible.sample.CalendarStore', {
    extend: 'Ext.data.Store',
    model: 'Ext.ensible.cal.CalendarRecord',
    
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'calendars'
        },
        writer: {
            type: 'json'
        }
    },

    sorters: [{
        property: Ext.ensible.cal.CalendarMappings.Title.name,
        direction: 'ASC'
    }],
    
    autoLoad: true,
    storeId: 'calendarStore',
    idProperty: Ext.ensible.cal.CalendarMappings.CalendarId.name || 'id',
    fields: Ext.ensible.cal.CalendarRecord.prototype.fields.getRange()
});