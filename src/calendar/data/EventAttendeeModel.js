Ext.define('Extensible.calendar.data.EventAttendeeModel', {
    extend: 'Extensible.data.Model',
    
    requires: [
        'Extensible.calendar.data.EventAttendeeMappings'
    ],
    
    mappingClass: 'Extensible.calendar.data.EventAttendeeMappings',
    
    mappingIdProperty: 'Email',
    
    associations: [{
        type: 'belongsTo',
        model: 'Extensible.calendar.data.EventModel'
    }]
},
function() {
    this.reconfigure();
});