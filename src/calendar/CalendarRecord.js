/**
 * @class Ext.ensible.cal.CalendarMappings
 * @extends Object
 * A simple object that provides the field definitions for 
 * {@link Ext.ensible.cal.CalendarRecord CalendarRecord}s so that they can be easily overridden.
 * 
 * <p>There are several ways of overriding the default Calendar record mappings to customize how 
 * Ext records are mapped to your back-end data model. If you only need to change a handful 
 * of field properties you can directly modify the CalendarMappings object as needed and then 
 * reconfigure it. The simplest approach is to only override specific field attributes:</p>
 * <pre><code>
var M = Ext.ensible.cal.CalendarMappings;
M.Title.mapping = 'cal_title';
M.Title.name = 'CalTitle';
Ext.ensible.cal.CalendarRecord.reconfigure();
</code></pre>
 * 
 * <p>You can alternately override an entire field definition using object-literal syntax, or 
 * provide your own custom field definitions (as in the following example). Note that if you do 
 * this, you <b>MUST</b> include a complete field definition, including the <tt>type</tt> attribute
 * if the field is not the default type of <tt>string</tt>.</p>
 * <pre><code>
// Add a new field that does not exist in the default CalendarMappings:
Ext.ensible.cal.CalendarMappings.Owner = {
    name: 'Owner',
    mapping: 'owner',
    type: 'string'
};
Ext.ensible.cal.CalendarRecord.reconfigure();
</code></pre>
 * 
 * <p>If you are overriding a significant number of field definitions it may be more convenient 
 * to simply redefine the entire EventMappings object from scratch. The following example
 * redefines the same fields that exist in the standard EventRecord object but the names and 
 * mappings have all been customized. Note that the name of each field definition object 
 * (e.g., 'EventId') should <b>NOT</b> be changed for the default EventMappings fields as it 
 * is the key used to access the field data programmatically.</p>
 * <pre><code>
Ext.ensible.cal.CalendarMappings = {
    CalendarId:   {name:'CalendarId', mapping: 'id', type: 'int'},
    Title:        {name:'Title', mapping: 'title', type: 'string'},
    Description:  {name:'Description', mapping: 'desc', type: 'string'},
    ColorId:      {name:'ColorId', mapping: 'color', type: 'int'},
    IsHidden:     {name:'IsHidden', mapping: 'hidden', type: 'boolean'},
    
    // We can also add some new fields that do not exist in the standard EventRecord:
    Owner:        {name: 'Owner', mapping: 'owner'}
};
// Don't forget to reconfigure!
Ext.ensible.cal.CalendarRecord.reconfigure();
</code></pre>
 * 
 * <p><b>NOTE:</b> Any record reconfiguration you want to perform must be done <b>PRIOR to</b> 
 * initializing your data store, otherwise the changes will not be reflected in the store's records.</p>
 * 
 * <p>Another important note is that if you alter the default mapping for <tt>CalendarId</tt>, make sure to add
 * that mapping as the <tt>idProperty</tt> of your data reader, otherwise it won't recognize how to
 * access the data correctly and will treat existing records as phantoms. For example:</p>
 * <pre><code>
var reader = new Ext.data.JsonReader({
    totalProperty: 'total',
    successProperty: 'success',
    root: 'data',
    messageProperty: 'message',
    
    // read the id property generically, regardless of the mapping:
    idProperty: Ext.ensible.cal.CalendarMappings.CalendarId.mapping  || 'id',
    
    // this is also a handy way to configure your reader's fields generically:
    fields: Ext.ensible.cal.CalendarRecord.prototype.fields.getRange()
});
</code></pre>
 */
Ext.ensible.cal.CalendarMappings = {
    CalendarId:   {name:'CalendarId', mapping: 'id', type: 'int'},
    Title:        {name:'Title', mapping: 'title', type: 'string'},
    Description:  {name:'Description', mapping: 'desc', type: 'string'},
    ColorId:      {name:'ColorId', mapping: 'color', type: 'int'},
    IsHidden:     {name:'IsHidden', mapping: 'hidden', type: 'boolean'}
};

/**
 * @class Ext.ensible.cal.CalendarRecord
 * @extends Ext.data.Record
 * <p>This is the {@link Ext.data.Record Record} specification for calendar items used by the
 * {@link Ext.ensible.cal.CalendarPanel CalendarPanel}'s calendar store. If your model fields 
 * are named differently you should update the <b>mapping</b> configs accordingly.</p>
 * <p>The only required fields when creating a new calendar record instance are CalendarId and
 * Title.  All other fields are either optional or will be defaulted if blank.</p>
 * <p>Here is a basic example for how to create a new record of this type:<pre><code>
rec = new Ext.ensible.cal.CalendarRecord({
    CalendarId: 5,
    Title: 'My Holidays',
    Description: 'My personal holiday schedule',
    ColorId: 3
});
</code></pre>
 * If you have overridden any of the record's data mappings via the {@link Ext.ensible.cal.CalendarMappings CalendarMappings} object
 * you may need to set the values using this alternate syntax to ensure that the fields match up correctly:<pre><code>
var M = Ext.ensible.cal.CalendarMappings;

rec = new Ext.ensible.cal.CalendarRecord();
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
Ext.ensible.cal.CalendarRecord = Ext.extend(Ext.data.Record, {
    fields: new Ext.util.MixedCollection(false, function(field){
        return field.name;
    })
});

/**
 * Reconfigures the default record definition based on the current {@link Ext.ensible.cal.CalendarMappings CalendarMappings}
 * object. See the header documentation for {@link Ext.ensible.cal.CalendarMappings} for complete details and 
 * examples of reconfiguring a CalendarRecord.
 * @method create
 * @static
 * @return {Function} The updated CalendarRecord constructor function
 */
Ext.ensible.cal.CalendarRecord.reconfigure = function(){
    var C = Ext.ensible.cal,
        M = C.CalendarMappings,
        proto = C.CalendarRecord.prototype,
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
    return C.CalendarRecord;
};

// Create the default definition now:
Ext.ensible.cal.CalendarRecord.reconfigure();