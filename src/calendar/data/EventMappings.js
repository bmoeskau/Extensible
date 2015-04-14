/**
 * @class Extensible.calendar.data.EventMappings
 * @extends Object
 * A simple object that provides the field definitions for
 * {@link Extensible.calendar.EventRecord EventRecord}s so that they can be easily overridden.
 *
 * There are several ways of overriding the default Event record mappings to customize how
 * Ext records are mapped to your back-end data model. If you only need to change a handful
 * of field properties you can directly modify the EventMappings object as needed and then
 * reconfigure it. The simplest approach is to only override specific field attributes:
 * 
 *		var M = Extensible.calendar.data.EventMappings;
 *			M.Title.mapping = 'evt_title';
 *			M.Title.name = 'EventTitle';
 *			Extensible.calendar.EventRecord.reconfigure();
 *
 * You can alternately override an entire field definition using object-literal syntax, or
 * provide your own custom field definitions (as in the following example). Note that if you do
 * this, you **MUST** include a complete field definition, including the <tt>type</tt> attribute
 * if the field is not the default type of <tt>string</tt>.
 * 
 *		// Add a new field that does not exist in the default EventMappings:
 *		Extensible.calendar.data.EventMappings.Timestamp = {
 *			name: 'Timestamp',
 *			mapping: 'timestamp',
 *			type: 'date'
 *		};
 *		Extensible.calendar.EventRecord.reconfigure();
 *
 * If you are overriding a significant number of field definitions it may be more convenient
 * to simply redefine the entire EventMappings object from scratch. The following example
 * redefines the same fields that exist in the standard EventRecord object but the names and
 * mappings have all been customized. Note that the name of each field definition object
 * (e.g., 'EventId') should **NOT** be changed for the default EventMappings fields as it
 * is the key used to access the field data programmatically.
 * 
 *		Extensible.calendar.data.EventMappings = {
 *			EventId:     {name: 'ID', mapping:'evt_id', type:'int'},
 *			CalendarId:  {name: 'CalID', mapping: 'cal_id', type: 'int'},
 *			Title:       {name: 'EvtTitle', mapping: 'evt_title'},
 *			StartDate:   {name: 'StartDt', mapping: 'start_dt', type: 'date', dateFormat: 'c'},
 *			EndDate:     {name: 'EndDt', mapping: 'end_dt', type: 'date', dateFormat: 'c'},
 *			RRule:       {name: 'RecurRule', mapping: 'recur_rule'},
 *			Location:    {name: 'Location', mapping: 'location'},
 *			Notes:       {name: 'Desc', mapping: 'full_desc'},
 *			Url:         {name: 'LinkUrl', mapping: 'link_url'},
 *			IsAllDay:    {name: 'AllDay', mapping: 'all_day', type: 'boolean'},
 *			Reminder:    {name: 'Reminder', mapping: 'reminder'},
 *		    // We can also add some new fields that do not exist in the standard EventRecord:
 *			CreatedBy:   {name: 'CreatedBy', mapping: 'created_by'},
 *			IsPrivate:   {name: 'Private', mapping:'private', type:'boolean'}
 *		};
 *		// Don't forget to reconfigure!
 *		Extensible.calendar.EventRecord.reconfigure();
 *
 * **NOTE:** Any record reconfiguration you want to perform must be done **PRIOR to**
 * initializing your data store, otherwise the changes will not be reflected in the store's records.
 *
 * Another important note is that if you alter the default mapping for <tt>EventId</tt>, make sure to add
 * that mapping as the <tt>idProperty</tt> of your data reader, otherwise it won't recognize how to
 * access the data correctly and will treat existing records as phantoms. Here's an easy way to make sure
 * your mapping is always valid:
 * 
 *		var reader = new Ext.data.reader.Json({
 *			totalProperty: 'total',
 *			successProperty: 'success',
 * 			root: 'data',
 * 			messageProperty: 'message',
 *		    // read the id property generically, regardless of the mapping:
 *			idProperty: Extensible.calendar.data.EventMappings.EventId.mapping  || 'id',
 *		    // this is also a handy way to configure your reader's fields generically:
 *			fields: Extensible.calendar.EventRecord.prototype.fields.getRange()
 *		});
 */
Ext.ns('Extensible.calendar.data');

// @define Extensible.calendar.data.EventMappings
Extensible.calendar.data.EventMappings = {
    EventId: {
        name:    'id',
        mapping: 'id',
        type:    'string'
    },
    CalendarId: {
        name:    'cid',
        mapping: 'cid',
        type:    'string'
    },
    Title: {
        name:    'title',
        mapping: 'title',
        type:    'string'
    },
    StartDate: {
        name:       'start',
        mapping:    'start',
        type:       'date',
        dateFormat: 'c'
    },
    EndDate: {
        name:       'end',
        mapping:    'end',
        type:       'date',
        dateFormat: 'c'
    },
    Location: {
        name:    'loc',
        mapping: 'loc',
        type:    'string'
    },
    Notes: {
        name:    'notes',
        mapping: 'notes',
        type:    'string'
    },
    Url: {
        name:    'url',
        mapping: 'url',
        type:    'string'
    },
    IsAllDay: {
        name:    'ad',
        mapping: 'ad',
        type:    'boolean'
    },
    Reminder: {
        name:    'rem',
        mapping: 'rem',
        type:    'string'
    },
    
// ----- Recurrence properties -----

    // NOTE: Only RRule and Duration need to be persisted. The other properties
    // do need to be mapped as they are used on the back end, but typically they
    // are transient properties only used during processing of requests and do
    // not need to be stored in a DB.
    
    // The iCal-formatted RRULE (recurrence rule) pattern.
    // (See: http://www.kanzaki.com/docs/ical/rrule.html)
    // While technically recurrence could be implemented in other custom
    // ways, the iCal format is the de facto industry standard, offers
    // interoperability with other calendar apps (e.g. Google Calendar,
    // Apple iCal, etc.) and provides a compact storage format. You could
    // choose to provide a custom implementation, but out of the box only
    // the iCal RRULE format is handled by the components.
    RRule: {
        name:    'rrule',
        mapping: 'rrule',
        type:    'string',
        allowNull: true
    },
    
    // When using recurrence, the standard EndDate value will be the end date
    // of the _recurrence series_, not the end date of the "event". In fact,
    // with recurrence there is no single "event", only a pattern that generates
    // event instances, each of which has a separate start and end date.
    // Because of this we also store the duration of the event when using
    // recurrence so that the end date of each event instance can be
    // properly calculated.
    Duration: {
        name:         'duration',
        mapping:      'duration',
        defaultValue: -1,   // the standard int default of 0 is actually a valid duration
        allowNull:     true, // Without this, the null returned from the server is coerced to 0
        type:         'int'
    },
    
    // This is used to associate recurring event instances back to their
    // original master events when sending edit requests to the server. This
    // is required since each individual event instance will have a unique id
    // (required by Ext stores) which is not guaranteed to be a real PK since
    // typically these will be generated from the RRULE pattern, not real events
    // that exist in the DB.
    OriginalEventId: {
        name:    'origid',
        mapping: 'origid',
        type:    'string',
        allowNull: true
    },
    
    // The start date for the recurring series.
    RSeriesStartDate: {
        name:       'rsstart',
        mapping:    'rsstart',
        type:       'date',
        dateFormat: 'c',
        allowNull:  true
    },
    
    // If the start date of a recurring event instance is changed and then saved
    // using the "single" instance case (or if you drag an event instance and drop
    // it on a different date) the server has to create an exception for that instance
    // in the series. Since the instance being sent to the server by default only has
    // the updated start date, you need a way to pass the original unedited start date
    // to be used as the exception date, which is what this instance start date is for.
    RInstanceStartDate: {
        name:       'ristart',
        mapping:    'ristart',
        type:       'date',
        dateFormat: 'c',
        allowNull:   true
    },
    
    // Recurrence edit mode ('single', 'future' or 'all'). This is transient data
    // and would typically not be persisted (it's ignored by the calendar for
    // display purposes), but it's kept on the record for ease of transmission to
    // the server, and because multiple batched events could have different edit modes.
    REditMode: {
        name:    'redit',
        mapping: 'redit',
        type:    'string',
        allowNull: true
    }
};