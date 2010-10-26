/**
 * @class Ext.ensible.cal.EventEditForm
 * @extends Ext.form.FormPanel
 * <p>A custom form used for detailed editing of events.</p>
 * <p>This is pretty much a standard form that is simply pre-configured for the options needed by the
 * calendar components. It is also configured to automatically bind records of type {@link Ext.ensible.cal.EventRecord}
 * to and from the form.</p>
 * <p>This form also provides custom events specific to the calendar so that other calendar components can be easily
 * notified when an event has been edited via this component.</p>
 * <p>The default configs are as follows:</p><pre><code>
    labelWidth: 65,
    title: 'Event Form',
    titleTextAdd: 'Add Event',
    titleTextEdit: 'Edit Event',
    bodyStyle: 'background:transparent;padding:20px 20px 10px;',
    border: false,
    buttonAlign: 'center',
    autoHeight: true, // to allow for the notes field to autogrow
    cls: 'ext-evt-edit-form',
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.EventEditForm = Ext.extend(Ext.form.FormPanel, {
    labelWidth: 65,
    title: 'Event Form',
    titleTextAdd: 'Add Event',
    titleTextEdit: 'Edit Event',
    bodyStyle: 'padding:20px 20px 10px;',
    border: false,
    buttonAlign: 'center',
    autoHeight: true, // to allow for the notes field to autogrow
    cls: 'ext-evt-edit-form',
    
    /**
     * @cfg {Boolean} enableRecurrence
     * True to show the recurrence field, false to hide it (default). Note that recurrence requires
     * something on the server-side that can parse the iCal RRULE format in order to generate the
     * instances of recurring events to display on the calendar, so this field should only be enabled
     * if the server supports it.
     */
    enableRecurrence: false,
    
    // private properties:
    newId: 10000,
    layout: 'column',
    
    // private
    initComponent: function(){
        
        this.addEvents({
            /**
             * @event eventadd
             * Fires after a new event is added
             * @param {Ext.ensible.cal.EventEditForm} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was added
             */
            eventadd: true,
            /**
             * @event eventupdate
             * Fires after an existing event is updated
             * @param {Ext.ensible.cal.EventEditForm} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was updated
             */
            eventupdate: true,
            /**
             * @event eventdelete
             * Fires after an event is deleted
             * @param {Ext.ensible.cal.EventEditForm} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was deleted
             */
            eventdelete: true,
            /**
             * @event eventcancel
             * Fires after an event add/edit operation is canceled by the user and no store update took place
             * @param {Ext.ensible.cal.EventEditForm} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was canceled
             */
            eventcancel: true
        });
                
        this.titleField = new Ext.form.TextField({
            fieldLabel: 'Title',
            name: Ext.ensible.cal.EventMappings.Title.name,
            anchor: '90%'
        });
        this.dateRangeField = new Ext.ensible.cal.DateRangeField({
            fieldLabel: 'When',
            singleLine: false,
            anchor: '90%',
            listeners: {
                'change': this.onDateChange.createDelegate(this)
            }
        });
        this.reminderField = new Ext.ensible.cal.ReminderField({
            name: 'Reminder'
        });
        this.notesField = new Ext.form.TextArea({
            fieldLabel: 'Notes',
            name: Ext.ensible.cal.EventMappings.Notes.name,
            grow: true,
            growMax: 150,
            anchor: '100%'
        });
        this.locationField = new Ext.form.TextField({
            fieldLabel: 'Location',
            name: Ext.ensible.cal.EventMappings.Location.name,
            anchor: '100%'
        });
        this.urlField = new Ext.form.TextField({
            fieldLabel: 'Web Link',
            name: Ext.ensible.cal.EventMappings.Url.name,
            anchor: '100%'
        });
        
        var leftFields = [this.titleField, this.dateRangeField, this.reminderField], 
            rightFields = [this.notesField, this.locationField, this.urlField];
            
        if(this.enableRecurrence){
            this.recurrenceField = new Ext.ensible.cal.RecurrenceField({
                name: Ext.ensible.cal.EventMappings.RRule.name,
                anchor: '100%'
            });
            leftFields.splice(2, 0, this.recurrenceField);
        }
        
        if(this.calendarStore){
            this.calendarField = new Ext.ensible.cal.CalendarCombo({
                store: this.calendarStore,
                name: Ext.ensible.cal.EventMappings.CalendarId.name
            });
            leftFields.splice(2, 0, this.calendarField);
        };
        
        this.items = [{
            id: this.id+'-left-col',
            columnWidth: .65,
            layout: 'form',
            border: false,
            items: leftFields
        },{
            id: this.id+'-right-col',
            columnWidth: .35,
            layout: 'form',
            border: false,
            items: rightFields
        }];
        
        this.fbar = [{
            text:'Save', scope: this, handler: this.onSave
        },{
            cls:'ext-del-btn', text:'Delete', scope:this, handler:this.onDelete
        },{
            text:'Cancel', scope: this, handler: this.onCancel
        }];
        
        Ext.ensible.cal.EventEditForm.superclass.initComponent.call(this);
    },
    
    // private
    onDateChange: function(dateRangeField, val){
        if(this.recurrenceField){
            this.recurrenceField.setStartDate(val[0]);
        }
    },
    
    // inherited docs
    loadRecord: function(rec){
        this.form.loadRecord.apply(this.form, arguments);
        this.activeRecord = rec;
        this.dateRangeField.setValue(rec.data);
        this.recurrenceField.setStartDate(rec.data[Ext.ensible.cal.EventMappings.StartDate.name]);
        
        if(this.calendarStore){
            this.form.setValues({'calendar': rec.data[Ext.ensible.cal.EventMappings.CalendarId.name]});
        }
        
        this.isAdd = !!rec.data[Ext.ensible.cal.EventMappings.IsNew.name];
        if(this.isAdd){
            rec.markDirty();
            this.setTitle(this.titleTextAdd);
            Ext.select('.ext-del-btn').setDisplayed(false);
        }
        else {
            this.setTitle(this.titleTextEdit);
            Ext.select('.ext-del-btn').setDisplayed(true);
        }
        this.titleField.focus();
    },
    
    // inherited docs
    updateRecord: function(){
        var dates = this.dateRangeField.getValue();
            
        this.form.updateRecord(this.activeRecord);
        this.activeRecord.set(Ext.ensible.cal.EventMappings.StartDate.name, dates[0]);
        this.activeRecord.set(Ext.ensible.cal.EventMappings.EndDate.name, dates[1]);
        this.activeRecord.set(Ext.ensible.cal.EventMappings.IsAllDay.name, dates[2]);
    },
    
    // private
    onCancel: function(){
        this.cleanup(true);
        this.fireEvent('eventcancel', this, this.activeRecord);
    },
    
    // private
    cleanup: function(hide){
        if(this.activeRecord && this.activeRecord.dirty){
            this.activeRecord.reject();
        }
        delete this.activeRecord;
        
        if(this.form.isDirty()){
            this.form.reset();
        }
    },
    
    // private
    onSave: function(){
        if(!this.form.isValid()){
            return;
        }
        this.updateRecord();
        
        if(!this.activeRecord.dirty){
            this.onCancel();
            return;
        }
        
        this.fireEvent(this.isAdd ? 'eventadd' : 'eventupdate', this, this.activeRecord);
    },

    // private
    onDelete: function(){
        this.fireEvent('eventdelete', this, this.activeRecord);
    }
});

Ext.reg('extensible.eventeditform', Ext.ensible.cal.EventEditForm);
