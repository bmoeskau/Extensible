/**
 * @class Extensible.calendar.data.CalendarModel
 * @extends Extensible.data.Model
 * <p>This is the {@link Ext.data.Model Model} specification for calendar items used by the
 * {@link Extensible.calendar.CalendarPanel CalendarPanel}'s calendar store. If your model fields
 * are named differently you should update the <b>mapping</b> configs accordingly.</p>
 * <p>The only required fields when creating a new calendar record instance are CalendarId and
 * Title.  All other fields are either optional or will be defaulted if blank.</p>
 * <p>Here is a basic example for how to create a new record of this type:<pre><code>
rec = new Extensible.calendar.data.CalendarModel({
    CalendarId: 5,
    Title: 'My Holidays',
    Description: 'My personal holiday schedule',
    ColorId: 3
});
</code></pre>
 * If you have overridden any of the record's data mappings via the {@link Extensible.calendar.data.CalendarMappings CalendarMappings} object
 * you may need to set the values using this alternate syntax to ensure that the fields match up correctly:<pre><code>
var M = Extensible.calendar.data.CalendarMappings;

rec = new Extensible.calendar.data.CalendarModel();
rec.data[M.CalendarId.name] = 5;
rec.data[M.Title.name] = 'My Holidays';
rec.data[M.Description.name] = 'My personal holiday schedule';
rec.data[M.ColorId.name] = 3;
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
Ext.define('Extensible.calendar.data.CalendarModel', {
    extend: 'Extensible.data.Model',
    
    requires: [
        'Extensible.calendar.data.CalendarMappings'
    ],
    
    mappingClass: 'Extensible.calendar.data.CalendarMappings',
    
    mappingIdProperty: 'CalendarId'
    
},
function() {
    this.reconfigure();
});