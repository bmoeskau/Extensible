/**
 * @class Extensible.calendar.data.EventModel
 * @extends Extensible.data.Model
 * <p>This is the {@link Ext.data.Record Record} specification for calendar event data used by the
 * {@link Extensible.calendar.CalendarPanel CalendarPanel}'s underlying store. It can be overridden as
 * necessary to customize the fields supported by events, although the existing field definition names
 * should not be altered. If your model fields are named differently you should update the <b>mapping</b>
 * configs accordingly.</p>
 * <p>The only required fields when creating a new event record instance are <tt>StartDate</tt> and
 * <tt>EndDate</tt>.  All other fields are either optional or will be defaulted if blank.</p>
 * <p>Here is a basic example for how to create a new record of this type:<pre><code>
rec = new Extensible.calendar.data.EventModel({
    StartDate: '2101-01-12 12:00:00',
    EndDate: '2101-01-12 13:30:00',
    Title: 'My cool event',
    Notes: 'Some notes'
});
</code></pre>
 * If you have overridden any of the record's data mappings via the {@link Extensible.calendar.data.EventMappings EventMappings} object
 * you may need to set the values using this alternate syntax to ensure that the field names match up correctly:<pre><code>
var M = Extensible.calendar.data.EventMappings,
    rec = new Extensible.calendar.data.EventModel();

rec.data[M.StartDate.name] = '2101-01-12 12:00:00';
rec.data[M.EndDate.name] = '2101-01-12 13:30:00';
rec.data[M.Title.name] = 'My cool event';
rec.data[M.Notes.name] = 'Some notes';
</code></pre>
 * @constructor
 * @param {Object} data (Optional) An object, the properties of which provide values for the new Record's
 * fields. If not specified the {@link Ext.data.Field#defaultValue defaultValue}
 * for each field will be assigned.
 * @param {Object} id (Optional) The id of the Record. The id is used by the
 * {@link Ext.data.Store} object which owns the Record to index its collection
 * of Records (therefore this id should be unique within each store). If an
 * id is not specified a {@link #phantom}
 * Record will be created with an {@link #Record.id automatically generated id}.
 */
Ext.define('Extensible.calendar.data.EventModel', {
    extend: 'Extensible.data.Model',

    requires: [
        'Extensible.calendar.data.EventMappings'
    ],
    
    mappingClass: 'Extensible.calendar.data.EventMappings',
    
    mappingIdProperty: 'EventId',

    isRecurring: function() {
        var rrule = this.data[Extensible.calendar.data.EventMappings.RRule.name];
        return (rrule !== undefined && rrule !== '');
    }
},
function() {
    this.reconfigure();
});