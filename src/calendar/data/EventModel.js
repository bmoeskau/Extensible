/**
 * This is the {@link Ext.data.Model Model} specification for calendar event data used by the
 * {@link Extensible.calendar.CalendarPanel CalendarPanel}'s underlying store. It can be overridden as
 * necessary to customize the fields supported by events, although the existing field definition names
 * should not be altered. If your model fields are named differently you should update the **mapping**
 * configs accordingly.
 * 
 * The only required fields when creating a new event record instance are <tt>StartDate</tt> and
 * <tt>EndDate</tt>.  All other fields are either optional or will be defaulted if blank.
 * 
 * Here is a basic example for how to create a new record of this type:
 *		rec = new Extensible.calendar.data.EventModel({
 *			StartDate: '2101-01-12 12:00:00',
 *			EndDate: '2101-01-12 13:30:00',
 *			Title: 'My cool event',
 *			Notes: 'Some notes'
 *		});
 *  
 * If you have overridden any of the record's data mappings via the {@link Extensible.calendar.data.EventMappings EventMappings} object
 * you may need to set the values using this alternate syntax to ensure that the field names match up correctly:
 *		var M = Extensible.calendar.data.EventMappings,
 *		rec = new Extensible.calendar.data.EventModel();
 *			rec.data[M.StartDate.name] = '2101-01-12 12:00:00';
 *			rec.data[M.EndDate.name] = '2101-01-12 13:30:00';
 *			rec.data[M.Title.name] = 'My cool event';
 *			rec.data[M.Notes.name] = 'Some notes';
 */
Ext.define('Extensible.calendar.data.EventModel', {
    extend: 'Extensible.data.Model',

    requires: [
        'Extensible.calendar.data.EventMappings'
    ],
    
    mappingClass: 'Extensible.calendar.data.EventMappings',
    
    mappingIdProperty: 'id',
    
    // Experimental, not currently used:
    // associations: [{
        // type: 'hasMany',
        // model: 'Extensible.calendar.data.EventModel',
        // primaryKey: 'EventId',
        // foreignKey: 'ParentId',
        // autoLoad: true
    // },{
        // type: 'belongsTo',
        // model: 'Extensible.calendar.data.EventModel',
        // primaryKey: 'EventId',
        // foreignKey: 'ParentId'
    // }],

    inheritableStatics: {
        /**
         * The minimum time unit supported by events (defaults to 'minutes'). Other valid
         * values would be 'seconds' or 'millis'. This is used primarily in calculating date
         * ranges and event duration.  For example, an all-day event will be saved with a start time
         * of 0:00:00-00 and an end time of 0:00:00-00 the next day minus 1 unit as specified by this
         * resolution setting (1 minute by default, resulting in an end time of 23:59:00-00). This
         * setting could be changed to provide greater resolution, e.g. 'seconds' would result in an
         * all-day end time of 23:59:59-00 instead (although, by default, this would not result in
         * any visible display difference unless the calendar views were also customized).
         */
        resolution: 'minutes'
    },
    
    isRecurring: function() {
        var RRule = Extensible.calendar.data.EventMappings.RRule;
        
        if (RRule) {
            return !!this.get(RRule.name);
        }
        return false;
    },
    
    getStartDate: function() {
        return this.get(Extensible.calendar.data.EventMappings.StartDate.name);
    },
    
    getEndDate: function() {
        var EventMappings = Extensible.calendar.data.EventMappings,
            duration = EventMappings.Duration ? this.get(EventMappings.Duration.name) : null;
        
        if (duration !== null && duration > -1) {
            var durationObj = {};
            durationObj[Extensible.calendar.data.EventModel.resolution] = duration;
            return Extensible.Date.add(this.getStartDate(), durationObj);
        }
        return this.get(EventMappings.EndDate.name);
    },
    
    clearRecurrence: function() {
        var me = this,
            EventMappings = Extensible.calendar.data.EventMappings;
        
        delete me.data[EventMappings.OriginalEventId.name];
        delete me.data[EventMappings.RRule.name];
        delete me.data[EventMappings.RInstanceStartDate.name];
        delete me.data[EventMappings.REditMode.name];
        
        return me;
    },
    
    // Sencha broke getId() for mapped ids in 4.2. Mappings are required by Extensible and this method
    // began returning undefined for the record ids in 4.2. This override is here simply
    // to reinstate the 4.1.x version that still works as expected:
    getId: function() {
        return this.get(this.idProperty);
    }
},
function() {
    this.reconfigure();
});