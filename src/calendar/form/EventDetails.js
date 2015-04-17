/**
 * A custom form used for detailed editing of events.
 * 
 * This is pretty much a standard form that is simply pre-configured for the options needed by the
 * calendar components. It is also configured to automatically bind records of type
 * {@link Extensible.calendar.data.EventModel EventModel} to and from the form.
 * 
 * This form also provides custom events specific to the calendar so that other calendar components can be easily
 * notified when an event has been edited via this component.
 * 
 * The default configs are as follows:
 *		labelWidth: 65,
 *		labelWidthRightCol: 65,
 *		colWidthLeft: '.9',
 *		colWidthRight: '.1',
 *		title: 'Event Form',
 *		titleTextAdd: 'Add Event',
 *		titleTextEdit: 'Edit Event',
 *		titleLabelText: 'Title',
 *		datesLabelText: 'When',
 *		reminderLabelText: 'Reminder',
 *		notesLabelText: 'Notes',
 *		locationLabelText: 'Location',
 *		webLinkLabelText: 'Web Link',
 *		calendarLabelText: 'Calendar',
 *		repeatsLabelText: 'Repeats',
 *		saveButtonText: 'Save',
 *		deleteButtonText: 'Delete',
 *		cancelButtonText: 'Cancel',
 *		bodyStyle: 'padding:20px 20px 10px;',
 *		border: false,
 *		buttonAlign: 'center',
 *		autoScroll: true,
 *		recurrence: false
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
    colWidthLeft: '.95',
    colWidthRight: '.05',
    fieldAnchor: '100%',
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
    /**
     * @cfg {Number} startDay
     * The 0-based index for the day on which the calendar week begins (0=Sunday, which is the default)
     */
    startDay: 0,

    /**
     * @cfg {Boolean} recurrence
     * @since 1.6.0
     * True to show the recurrence field, false to hide it (default). Note that recurrence requires
     * something on the server-side that can parse the iCal RRULE format in order to generate the
     * instances of recurring events to display on the calendar, so this field should only be enabled
     * if the server supports it.
     */
    recurrence: false,
    
    /**
     * @cfg {Boolean} allowDefaultAdd
     * @since 1.6.0
     * True to allow the user to save the initial default record displayed in the form while in Add mode
     * and the record is not dirty (default). If false, the form save action will be treated as a cancel action
     * if no editing was performed while in Add mode and the record will not be added. Note that this setting
     * does not apply when in Edit mode. The save action will always be treated as cancel in Edit mode if
     * the form is not dirty.
     *
     * When this option is true any blank or default field values should be allowed by the back end
     * system handling the operation. For example, by default if the event title is blank the calendar views
     * will substitute the value of {@link Extensible.calendar.view.AbstractCalendar#defaultEventTitleText
     * defaultEventTitleText} when displaying it. Any custom fields might require similar custom handling.
     */
    allowDefaultAdd: true,

	//private properties    
    layout: 'column',
    
    initComponent: function() {

        //this.addEvents({
        //    /**
        //     * @event eventadd
        //     * Fires after a new event is added
        //     * @param {Extensible.calendar.form.EventDetails} this
        //     * @param {Extensible.calendar.data.EventModel} rec The new {@link Extensible.calendar.data.EventModel
        //     * record} that was added
        //     */
        //    eventadd: true,
        //    /**
        //     * @event eventupdate
        //     * Fires after an existing event is updated
        //     * @param {Extensible.calendar.form.EventDetails} this
        //     * @param {Extensible.calendar.data.EventModel} rec The new {@link Extensible.calendar.data.EventModel
        //     * record} that was updated
        //     */
        //    eventupdate: true,
        //    /**
        //     * @event eventdelete
        //     * Fires after an event is deleted
        //     * @param {Extensible.calendar.form.EventDetails} this
        //     * @param {Extensible.calendar.data.EventModel} rec The new {@link Extensible.calendar.data.EventModel
        //     * record} that was deleted
        //     */
        //    eventdelete: true,
        //    /**
        //     * @event eventcancel
        //     * Fires after an event add/edit operation is canceled by the user and no store update took place
        //     * @param {Extensible.calendar.form.EventDetails} this
        //     * @param {Extensible.calendar.data.EventModel} rec The new {@link Extensible.calendar.data.EventModel
        //     * record} that was canceled
        //     */
        //    eventcancel: true
        //});

        this.titleField = Ext.create('Ext.form.field.Text', {
            fieldLabel: this.titleLabelText,
            name: Extensible.calendar.data.EventMappings.Title.name,
            anchor: this.fieldAnchor
        });
        this.dateRangeField = Ext.create('Extensible.form.field.DateRange', {
            fieldLabel: this.datesLabelText,
            singleLine: false,
            anchor: this.fieldAnchor,
            startDay: this.startDay,
            listeners: {
                'change': Ext.bind(this.onDateChange, this)
            }
        });
        this.reminderField = Ext.create('Extensible.calendar.form.field.ReminderCombo', {
            name: Extensible.calendar.data.EventMappings.Reminder.name,
            fieldLabel: this.reminderLabelText,
            anchor: this.fieldAnchor
        });
        this.notesField = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: this.notesLabelText,
            name: Extensible.calendar.data.EventMappings.Notes.name,
            grow: true,
            growMax: 150,
            anchor: this.fieldAnchor
        });
        this.locationField = Ext.create('Ext.form.field.Text', {
            fieldLabel: this.locationLabelText,
            name: Extensible.calendar.data.EventMappings.Location.name,
            anchor: this.fieldAnchor
        });
        this.urlField = Ext.create('Ext.form.field.Text', {
            fieldLabel: this.webLinkLabelText,
            name: Extensible.calendar.data.EventMappings.Url.name,
            anchor: this.fieldAnchor
        });
        
        // var leftFields = [this.titleField, this.dateRangeField, this.reminderField],
            // rightFields = [this.notesField, this.locationField, this.urlField];
            
        var rightFields = [],
            leftFields  = [this.titleField, this.dateRangeField, this.reminderField,
                           this.notesField, this.locationField, this.urlField];
            
        if(this.recurrence) {
            this.recurrenceField = Ext.create('Extensible.form.recurrence.Fieldset', {
                recurrenceOptions: this.recurrence,
                name: Extensible.calendar.data.EventMappings.RRule.name,
                fieldLabel: this.repeatsLabelText,
                startDay: this.startDay,
                anchor: this.fieldAnchor,
                listeners: {
                    'startchange': Ext.bind(this.onRecurrenceStartChange, this)
                }
            });
            leftFields.splice(2, 0, this.recurrenceField);
        }
        
        if(this.calendarStore) {
            this.calendarField = Ext.create('Extensible.calendar.form.field.CalendarCombo', {
                store: this.calendarStore,
                fieldLabel: this.calendarLabelText,
                name: Extensible.calendar.data.EventMappings.CalendarId.name,
                anchor: this.fieldAnchor
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
    
    onDateChange: function(dateRangeField, val) {
        if (this.recurrenceField) {
            this.recurrenceField.setStartDate(val[0]);
        }
    },
    
    onRecurrenceStartChange: function(recurrenceFieldset, startDate, oldDate) {
        this.dateRangeField.setValue(startDate);
    },
    
    /**
     * @protected 
     */
    loadRecord: function(rec) {
        var me = this,
            EventMappings = Extensible.calendar.data.EventMappings;
        
        me.form.reset().loadRecord.apply(me.form, arguments);
        me.activeRecord = rec;
        me.dateRangeField.setValue(rec.data);
        
        if (me.recurrenceField) {
            var recurrenceStart = rec.get(EventMappings.RSeriesStartDate.name) ||
                rec.get(EventMappings.StartDate.name);
            
            // Prevent a loop since the two start date fields sync on change
            me.recurrenceField.suspendEvents();
            me.recurrenceField.setStartDate(recurrenceStart);
            me.recurrenceField.setValue(rec.get(EventMappings.RRule.name));
            me.recurrenceField.resumeEvents();
            
            if (!rec.data[EventMappings.RInstanceStartDate.name]) {
                // If the record is new we have to set the instance start date explicitly to match the
                // field's default so that it does not show up later as dirty if it is not edited:
                rec.data[EventMappings.RInstanceStartDate.name] = rec.getStartDate();
            }
        }
        
        if (me.calendarField) {
            me.calendarField.setValue(rec.data[EventMappings.CalendarId.name]);
        }
        
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
    
    updateRecord: function(record) {
        var fields = record.fields,
            values = this.getForm().getValues(),
            EventMappings = Extensible.calendar.data.EventMappings,
            name,
            obj = {};

        Ext.each(fields, function(f) {
            name = f.name;
            if (name in values) {
                obj[name] = values[name];
            }
        });
        
        var dates = this.dateRangeField.getValue(),
            allday = obj[EventMappings.IsAllDay.name] = dates[2],
            // Clear times for all day events so that they are stored consistently
            startDate = allday ? Extensible.Date.clearTime(dates[0]) : dates[0],
            endDate = allday ? Extensible.Date.clearTime(dates[1]) : dates[1],
            singleDayDurationConfig = { days: 1 };
        
        // The full length of a day based on the minimum event time resolution:
        singleDayDurationConfig[Extensible.calendar.data.EventModel.resolution] = -1;
        
        obj[EventMappings.StartDate.name] = startDate;
        
        // If the event is all day, calculate the end date as midnight of the day after the end
        // date minus 1 unit based on the EventModel resolution, e.g. 23:59:00 on the end date
        obj[EventMappings.EndDate.name] = allday ?
            Extensible.Date.add(endDate, singleDayDurationConfig) : endDate;
        
        if (EventMappings.Duration) {
            obj[EventMappings.Duration.name] = Extensible.Date.diff(startDate, obj[EventMappings.EndDate.name],
                Extensible.calendar.data.EventModel.resolution);
        }
        
        record.set(obj);
        
        return record.dirty || (record.phantom && this.allowDefaultAdd);
    },
    
    onCancel: function() {
        this.cleanup(true);
        this.fireEvent('eventcancel', this, this.activeRecord);
    },
    
    cleanup: function(hide) {
        if (this.activeRecord) {
            this.activeRecord.reject();
        }
        delete this.activeRecord;
        
        if (this.form.isDirty()) {
            this.form.reset();
        }
    },
    
    onSave: function() {
        var me = this,
            originalHasRecurrence = me.activeRecord.isRecurring();
        
        if (!me.form.isValid() && !me.allowDefaultAdd) {
            return;
        }
        
        if (!me.updateRecord(me.activeRecord)) {
            me.onCancel();
            return;
        }
        
        if (me.activeRecord.phantom) {
            me.fireEvent('eventadd', me, me.activeRecord);
        }
        else {
            if (originalHasRecurrence && me.activeRecord.isRecurring()) {
                // We only need to prompt when editing an event that was recurring before being edited and is
                // still recurring after being edited. If a normal event is edited to make it recurring or a
                // recurring event is edited to make it normal just do a standard update.
                me.onRecurrenceUpdate();
            }
            else {
                me.fireEvent('eventupdate', me, me.activeRecord);
            }
        }
    },
    
    onRecurrenceUpdate: function() {
        this.rangeEditWin = this.rangeEditWin || Ext.WindowMgr.get('ext-cal-rangeeditwin');
        if (!this.rangeEditWin) {
            this.rangeEditWin = new Extensible.form.recurrence.RangeEditWindow();
        }
        this.rangeEditWin.prompt({
            callback: this.onRecurrenceEditModeSelected,
            scope: this
        });
    },
    
    onRecurrenceEditModeSelected: function(editMode) {
        var me = this;
        
        if (editMode) {
            me.activeRecord.data[Extensible.calendar.data.EventMappings.REditMode.name] = editMode;
            me.fireEvent('eventupdate', me, me.activeRecord, me.animateTarget);
        }
    },

    onDelete: function() {
        this.fireEvent('eventdelete', this, this.activeRecord);
    }
});