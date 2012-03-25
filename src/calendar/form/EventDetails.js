/**
 * @class Extensible.calendar.form.EventDetails
 * @extends Ext.form.FormPanel
 * <p>A custom form used for detailed editing of events.</p>
 * <p>This is pretty much a standard form that is simply pre-configured for the options needed by the
 * calendar components. It is also configured to automatically bind records of type {@link Extensible.calendar.data.EventModel}
 * to and from the form.</p>
 * <p>This form also provides custom events specific to the calendar so that other calendar components can be easily
 * notified when an event has been edited via this component.</p>
 * <p>The default configs are as follows:</p><pre><code>
labelWidth: 65,
labelWidthRightCol: 65,
colWidthLeft: .6,
colWidthRight: .4,
title: 'Event Form',
titleTextAdd: 'Add Event',
titleTextEdit: 'Edit Event',
titleLabelText: 'Title',
datesLabelText: 'When',
reminderLabelText: 'Reminder',
notesLabelText: 'Notes',
locationLabelText: 'Location',
webLinkLabelText: 'Web Link',
calendarLabelText: 'Calendar',
repeatsLabelText: 'Repeats',
saveButtonText: 'Save',
deleteButtonText: 'Delete',
cancelButtonText: 'Cancel',
bodyStyle: 'padding:20px 20px 10px;',
border: false,
buttonAlign: 'center',
autoHeight: true // to allow for the notes field to autogrow
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Extensible.calendar.form.EventDetails', {
    extend: 'Ext.form.Panel',
    alias: 'widget.extensible.eventeditform',
    
    requires: [
        'Extensible.form.field.DateRange',
        'Extensible.calendar.form.field.ReminderCombo',
        'Extensible.calendar.data.EventMappings',
        'Extensible.calendar.form.field.CalendarCombo',
        'Extensible.form.recurrence.Fieldset',
        'Ext.layout.container.Column',
        'Extensible.form.recurrence.RangeEditWindow'
    ],
    
    labelWidth: 65,
    labelWidthRightCol: 65,
    colWidthLeft: '.9',
    colWidthRight: '.1',
    title: 'Event Form',
    titleTextAdd: 'Add Event',
    titleTextEdit: 'Edit Event',
    titleLabelText: 'Title',
    datesLabelText: 'When',
    reminderLabelText: 'Reminder',
    notesLabelText: 'Notes',
    locationLabelText: 'Location',
    webLinkLabelText: 'Web Link',
    calendarLabelText: 'Calendar',
    repeatsLabelText: 'Repeats',
    saveButtonText: 'Save',
    deleteButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    bodyStyle: 'padding:20px 20px 10px;',
    border: false,
    buttonAlign: 'center',
    autoScroll: true,
    
    /* // not currently supported
     * @cfg {Boolean} recurrence
     * True to show the recurrence field, false to hide it (default). Note that recurrence requires
     * something on the server-side that can parse the iCal RRULE format in order to generate the
     * instances of recurring events to display on the calendar, so this field should only be enabled
     * if the server supports it.
     */
    recurrence: false,
    
    // private properties:
    layout: 'column',
    
    // private
    initComponent: function(){
        
        this.addEvents({
            /**
             * @event eventadd
             * Fires after a new event is added
             * @param {Extensible.calendar.form.EventDetails} this
             * @param {Extensible.calendar.data.EventModel} rec The new {@link Extensible.calendar.data.EventModel record} that was added
             */
            eventadd: true,
            /**
             * @event eventupdate
             * Fires after an existing event is updated
             * @param {Extensible.calendar.form.EventDetails} this
             * @param {Extensible.calendar.data.EventModel} rec The new {@link Extensible.calendar.data.EventModel record} that was updated
             */
            eventupdate: true,
            /**
             * @event eventdelete
             * Fires after an event is deleted
             * @param {Extensible.calendar.form.EventDetails} this
             * @param {Extensible.calendar.data.EventModel} rec The new {@link Extensible.calendar.data.EventModel record} that was deleted
             */
            eventdelete: true,
            /**
             * @event eventcancel
             * Fires after an event add/edit operation is canceled by the user and no store update took place
             * @param {Extensible.calendar.form.EventDetails} this
             * @param {Extensible.calendar.data.EventModel} rec The new {@link Extensible.calendar.data.EventModel record} that was canceled
             */
            eventcancel: true
        });
                
        this.titleField = Ext.create('Ext.form.TextField', {
            fieldLabel: this.titleLabelText,
            name: Extensible.calendar.data.EventMappings.Title.name,
            anchor: '70%'
        });
        this.dateRangeField = Ext.create('Extensible.form.field.DateRange', {
            fieldLabel: this.datesLabelText,
            singleLine: false,
            anchor: '70%',
            listeners: {
                'change': Ext.bind(this.onDateChange, this)
            }
        });
        this.reminderField = Ext.create('Extensible.calendar.form.field.ReminderCombo', {
            name: Extensible.calendar.data.EventMappings.Reminder.name,
            fieldLabel: this.reminderLabelText,
            anchor: '70%'
        });
        this.notesField = Ext.create('Ext.form.TextArea', {
            fieldLabel: this.notesLabelText,
            name: Extensible.calendar.data.EventMappings.Notes.name,
            grow: true,
            growMax: 150,
            anchor: '70%'
        });
        this.locationField = Ext.create('Ext.form.TextField', {
            fieldLabel: this.locationLabelText,
            name: Extensible.calendar.data.EventMappings.Location.name,
            anchor: '70%'
        });
        this.urlField = Ext.create('Ext.form.TextField', {
            fieldLabel: this.webLinkLabelText,
            name: Extensible.calendar.data.EventMappings.Url.name,
            anchor: '70%'
        });
        
        // var leftFields = [this.titleField, this.dateRangeField, this.reminderField],
            // rightFields = [this.notesField, this.locationField, this.urlField];
            
        var rightFields = [],
            leftFields  = [this.titleField, this.dateRangeField, this.reminderField,
                           this.notesField, this.locationField, this.urlField];
            
        if(this.recurrence){
            this.recurrenceField = Ext.create('Extensible.form.recurrence.Fieldset', {
                recurrenceOptions: this.recurrence,
                name: Extensible.calendar.data.EventMappings.RRule.name,
                fieldLabel: this.repeatsLabelText,
                anchor: '70%'
            });
            leftFields.splice(2, 0, this.recurrenceField);
        }
        
        if(this.calendarStore){
            this.calendarField = Ext.create('Extensible.calendar.form.field.CalendarCombo', {
                store: this.calendarStore,
                fieldLabel: this.calendarLabelText,
                name: Extensible.calendar.data.EventMappings.CalendarId.name,
                anchor: '70%'
            });
            leftFields.splice(2, 0, this.calendarField);
        }
        
        // Now that all fields are in one column by default, make sure we use
        // the largest configured label width for all fields:
        var labelWidth = Math.max(this.labelWidthRightCol, this.labelWidth);
        
        this.items = [{
            id: this.id+'-left-col',
            columnWidth: this.colWidthLeft,
            layout: 'anchor',
            fieldDefaults: {
                labelWidth: labelWidth
            },
            border: false,
            items: leftFields
        },{
            id: this.id+'-right-col',
            columnWidth: this.colWidthRight,
            layout: 'anchor',
            fieldDefaults: {
                labelWidth: labelWidth
            },
            border: false,
            items: rightFields
        }];
        
        this.fbar = [{
            text:this.saveButtonText, scope: this, handler: this.onSave
        },{
            itemId:this.id+'-del-btn', text:this.deleteButtonText, scope:this, handler:this.onDelete
        },{
            text:this.cancelButtonText, scope: this, handler: this.onCancel
        }];
        
        this.addCls('ext-evt-edit-form');
        
        Ext.apply(this.initialConfig, {
            trackResetOnLoad: true
        });
        
        this.callParent(arguments);
    },
    
    // private
    onDateChange: function(dateRangeField, val){
        if(this.recurrenceField){
            this.recurrenceField.setStartDate(val[0]);
        }
    },
    
    // inherited docs
    loadRecord: function(rec){
        var me = this,
            EventMappings = Extensible.calendar.data.EventMappings;
        
        me.form.reset().loadRecord.apply(me.form, arguments);
        me.activeRecord = rec;
        me.dateRangeField.setValue(rec.data);
        
        if (me.recurrenceField) {
            me.recurrenceField.setStartDate(rec.data[EventMappings.StartDate.name]);
            me.recurrenceField.setValue(rec.data[EventMappings.RRule.name]);
        }
        if (me.calendarStore) {
            me.form.setValues({'calendar': rec.data[EventMappings.CalendarId.name]});
        }
        
        //me.isAdd = !!rec.data[Extensible.calendar.data.EventMappings.IsNew.name];
        if (rec.phantom) {
            me.setTitle(me.titleTextAdd);
            me.down('#' + me.id + '-del-btn').hide();
        }
        else {
            me.setTitle(me.titleTextEdit);
            me.down('#' + me.id + '-del-btn').show();
        }
        
        // Using setValue() results in dirty fields, so we reset the field state
        // after loading the form so that the current values are the "original" values
        me.form.getFields().each(function(item) {
            item.resetOriginalValue();
        });
        
        me.titleField.focus();
    },
    
    // inherited docs
    updateRecord: function(){
        var dates = this.dateRangeField.getValue(),
            M = Extensible.calendar.data.EventMappings,
            rec = this.activeRecord,
            fs = rec.fields,
            dirty = false;
            
        rec.beginEdit();
        
        //TODO: This block is copied directly from BasicForm.updateRecord.
        // Unfortunately since that method internally calls begin/endEdit all
        // updates happen and the record dirty status is reset internally to
        // that call. We need the dirty status, plus currently the DateRangeField
        // does not map directly to the record values, so for now we'll duplicate
        // the setter logic here (we need to be able to pick up any custom-added
        // fields generically). Need to revisit this later and come up with a better solution.
        fs.each(function(f){
            var field = this.form.findField(f.name);
            if(field){
                var value = field.getValue();
                if (value.getGroupValue) {
                    value = value.getGroupValue();
                }
                else if (field.eachItem) {
                    value = [];
                    field.eachItem(function(item){
                        value.push(item.getValue());
                    });
                }
                rec.set(f.name, value);
            }
        }, this);
        
        rec.set(M.StartDate.name, dates[0]);
        rec.set(M.EndDate.name, dates[1]);
        rec.set(M.IsAllDay.name, dates[2]);
        
        dirty = rec.dirty;
        //delete rec.store; // make sure the record does not try to autosave
        rec.endEdit();
        
        return dirty;
    },
    
    getRecurrenceRangeEditor: function() {
        if (!this.recurrenceRangeEditor) {
            this.recurrenceRangeEditor = Ext.create('Extensible.form.recurrence.RangeEditWindow');
        }
        return this.recurrenceRangeEditor;
    },
    
    // private
    onCancel: function(){
        this.cleanup(true);
        this.fireEvent('eventcancel', this, this.activeRecord);
    },
    
    // private
    cleanup: function(hide){
        if (this.activeRecord) {
            this.activeRecord.reject();
        }
        delete this.activeRecord;
        
        if (this.form.isDirty()) {
            this.form.reset();
        }
    },
    
    // private
    onSave: function(){
        var me = this,
            isRecurring = me.activeRecord.isRecurring();
        
        if (!me.form.isValid()) {
            return;
        }
        
        if (!me.updateRecord()) {
            me.onCancel();
            return;
        }
        
        if (me.activeRecord.phantom) {
            me.fireEvent('eventadd', me, me.activeRecord);
        }
        else {
            //if (me.recurrenceField && (me.recurrenceField.isRecurring() || me.recurrenceField.isDirty())) {
            if (isRecurring || me.activeRecord.isRecurring()) {
                me.getRecurrenceRangeEditor().show();
            }
            else {
                me.fireEvent('eventupdate', me, me.activeRecord);
            }
        }
    },

    // private
    onDelete: function(){
        this.fireEvent('eventdelete', this, this.activeRecord);
    }
});