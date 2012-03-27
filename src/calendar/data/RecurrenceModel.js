Ext.define('Extensible.calendar.data.RecurrenceModel', {
    extend: 'Extensible.data.Model',

    requires: [
        'Extensible.calendar.data.RecurrenceMappings'
    ],
    
    mappingClass: 'Extensible.calendar.data.RecurrenceMappings',
    
    mappingIdProperty: 'RecurrenceId'
    
},
function() {
    this.reconfigure();
});