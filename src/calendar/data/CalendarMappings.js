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