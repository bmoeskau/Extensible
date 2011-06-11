/**
 * @class Ext.ensible.cal.EventRecord
 * @extends Ext.data.Record
 * <p>This is the {@link Ext.data.Record Record} specification for calendar event data used by the
 * {@link Ext.ensible.cal.CalendarPanel CalendarPanel}'s underlying store. It can be overridden as 
 * necessary to customize the fields supported by events, although the existing field definition names 
 * should not be altered. If your model fields are named differently you should update the <b>mapping</b>
 * configs accordingly.</p>
 * <p>The only required fields when creating a new event record instance are <tt>StartDate</tt> and
 * <tt>EndDate</tt>.  All other fields are either optional or will be defaulted if blank.</p>
 * <p>Here is a basic example for how to create a new record of this type:<pre><code>
rec = new Ext.ensible.cal.EventRecord({
    StartDate: '2101-01-12 12:00:00',
    EndDate: '2101-01-12 13:30:00',
    Title: 'My cool event',
    Notes: 'Some notes'
});
</code></pre>
 * If you have overridden any of the record's data mappings via the {@link Ext.ensible.cal.EventMappings EventMappings} object
 * you may need to set the values using this alternate syntax to ensure that the field names match up correctly:<pre><code>
var M = Ext.ensible.cal.EventMappings,
    rec = new Ext.ensible.cal.EventRecord();

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
Ext.define('Ext.ensible.cal.EventRecord', {
    extend: 'Ext.data.Model',
    
    idProperty: Ext.ensible.cal.EventMappings.EventId.name || 'id',

    initComponent: function() {
        this.fields = new Ext.util.MixedCollection(false, function(field){
            return field.name;
        });
        this.callParent(arguments);
    },
    
    statics: {
        /**
         * Reconfigures the default record definition based on the current {@link Ext.ensible.cal.EventMappings EventMappings}
         * object. See the header documentation for {@link Ext.ensible.cal.EventMappings} for complete details and 
         * examples of reconfiguring an EventRecord.
         * @method create
         * @static
         * @return {Function} The updated EventRecord constructor function
         */
        reconfigure: function() {
            var C = Ext.ensible.cal,
                M = C.EventMappings,
                proto = C.EventRecord.prototype,
                fields = [];
            
            for(prop in M){
                if(M.hasOwnProperty(prop)){
                    fields.push(M[prop]);
                }
            }
            proto.fields.clear();
            for(var i = 0, len = fields.length; i < len; i++){
                proto.fields.add(new Ext.data.Field(fields[i]));
            }
            return C.EventRecord;
        }
    }
});

// Create the default definition now:
Ext.ensible.cal.EventRecord.reconfigure();
