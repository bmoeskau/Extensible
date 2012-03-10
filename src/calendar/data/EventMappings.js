/**
 * @class Extensible.calendar.data.EventMappings
 * @extends Object
 * <p>A simple object that provides the field definitions for
 * {@link Extensible.calendar.EventRecord EventRecord}s so that they can be easily overridden.</p>
 *
 * <p>There are several ways of overriding the default Event record mappings to customize how
 * Ext records are mapped to your back-end data model. If you only need to change a handful
 * of field properties you can directly modify the EventMappings object as needed and then
 * reconfigure it. The simplest approach is to only override specific field attributes:</p>
 * <pre><code>
var M = Extensible.calendar.data.EventMappings;
M.Title.mapping = 'evt_title';
M.Title.name = 'EventTitle';
Extensible.calendar.EventRecord.reconfigure();
</code></pre>
 *
 * <p>You can alternately override an entire field definition using object-literal syntax, or
 * provide your own custom field definitions (as in the following example). Note that if you do
 * this, you <b>MUST</b> include a complete field definition, including the <tt>type</tt> attribute
 * if the field is not the default type of <tt>string</tt>.</p>
 * <pre><code>
// Add a new field that does not exist in the default EventMappings:
Extensible.calendar.data.EventMappings.Timestamp = {
    name: 'Timestamp',
    mapping: 'timestamp',
    type: 'date'
};
Extensible.calendar.EventRecord.reconfigure();
</code></pre>
 *
 * <p>If you are overriding a significant number of field definitions it may be more convenient
 * to simply redefine the entire EventMappings object from scratch. The following example
 * redefines the same fields that exist in the standard EventRecord object but the names and
 * mappings have all been customized. Note that the name of each field definition object
 * (e.g., 'EventId') should <b>NOT</b> be changed for the default EventMappings fields as it
 * is the key used to access the field data programmatically.</p>
 * <pre><code>
Extensible.calendar.data.EventMappings = {
    EventId:     {name: 'ID', mapping:'evt_id', type:'int'},
    CalendarId:  {name: 'CalID', mapping: 'cal_id', type: 'int'},
    Title:       {name: 'EvtTitle', mapping: 'evt_title'},
    StartDate:   {name: 'StartDt', mapping: 'start_dt', type: 'date', dateFormat: 'c'},
    EndDate:     {name: 'EndDt', mapping: 'end_dt', type: 'date', dateFormat: 'c'},
    RRule:       {name: 'RecurRule', mapping: 'recur_rule'},
    Location:    {name: 'Location', mapping: 'location'},
    Notes:       {name: 'Desc', mapping: 'full_desc'},
    Url:         {name: 'LinkUrl', mapping: 'link_url'},
    IsAllDay:    {name: 'AllDay', mapping: 'all_day', type: 'boolean'},
    Reminder:    {name: 'Reminder', mapping: 'reminder'},
    
    // We can also add some new fields that do not exist in the standard EventRecord:
    CreatedBy:   {name: 'CreatedBy', mapping: 'created_by'},
    IsPrivate:   {name: 'Private', mapping:'private', type:'boolean'}
};
// Don't forget to reconfigure!
Extensible.calendar.EventRecord.reconfigure();
</code></pre>
 *
 * <p><b>NOTE:</b> Any record reconfiguration you want to perform must be done <b>PRIOR to</b>
 * initializing your data store, otherwise the changes will not be reflected in the store's records.</p>
 *
 * <p>Another important note is that if you alter the default mapping for <tt>EventId</tt>, make sure to add
 * that mapping as the <tt>idProperty</tt> of your data reader, otherwise it won't recognize how to
 * access the data correctly and will treat existing records as phantoms. Here's an easy way to make sure
 * your mapping is always valid:</p>
 * <pre><code>
var reader = new Ext.data.JsonReader({
    totalProperty: 'total',
    successProperty: 'success',
    root: 'data',
    messageProperty: 'message',
    
    // read the id property generically, regardless of the mapping:
    idProperty: Extensible.calendar.data.EventMappings.EventId.mapping  || 'id',
    
    // this is also a handy way to configure your reader's fields generically:
    fields: Extensible.calendar.EventRecord.prototype.fields.getRange()
});
</code></pre>
 */
Ext.ns('Extensible.calendar.data');

Extensible.calendar.data.EventMappings = {
    EventId: {
        name:    'EventId',
        mapping: 'id',
        type:    'int'
    },
    CalendarId: {
        name:    'CalendarId',
        mapping: 'cid',
        type:    'int'
    },
    Title: {
        name:    'Title',
        mapping: 'title',
        type:    'string'
    },
    StartDate: {
        name:       'StartDate',
        mapping:    'start',
        type:       'date',
        dateFormat: 'c'
    },
    EndDate: {
        name:       'EndDate',
        mapping:    'end',
        type:       'date',
        dateFormat: 'c'
    },
    RRule: {
        name:    'RRule',
        mapping: 'rrule',
        type:    'string'
    },
    Location: {
        name:    'Location',
        mapping: 'loc',
        type:    'string'
    },
    Notes: {
        name:    'Notes',
        mapping: 'notes',
        type:    'string'
    },
    Url: {
        name:    'Url',
        mapping: 'url',
        type:    'string'
    },
    IsAllDay: {
        name:    'IsAllDay',
        mapping: 'ad',
        type:    'boolean'
    },
    Reminder: {
        name:    'Reminder',
        mapping: 'rem',
        type:    'string'
    }
};