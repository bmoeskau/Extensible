Ext.define('Extensible.calendar.form.EventViewWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.extensible.eventviewwindow',
    
    requires: [
        'Extensible.calendar.data.EventModel',
        'Extensible.calendar.data.EventMappings'
    ],
    
    // Locale configs
    title: 'Event Details',
    width: 400,
    height: 200,
    
    okButtonText: 'OK',
    // labelWidth: 65,
    // detailsLinkText: 'Edit Details...',
    // savingMessage: 'Saving changes...',
    // deletingMessage: 'Deleting event...',
    // saveButtonText: 'Save',
    // deleteButtonText: 'Delete',
    // cancelButtonText: 'Cancel',
    // titleLabelText: 'Title',
    // datesLabelText: 'When',
    // calendarLabelText: 'Calendar',
    
    // General configs
    closeAction: 'hide',
    modal: false,
    resizable: false,
    constrain: true,
    // buttonAlign: 'left',
    // editDetailsLinkClass: 'edit-dtl-link',
    // enableEditDetails: true,
    // layout: 'fit',
//     
    // formPanelConfig: {
        // border: false
    // },
    
    eventTpl: [
        '<h1>{Title}</h1>',
        '<p>{[this.formatDate(values.StartDate, values.IsAllDay)]}</p>',
        {
            formatDate: function(dt, allday) {
                return allday ? Ext.Date.format(dt, 'l F jS') + ' (all day)' : Ext.Date.format(dt, 'l F jS, h:i A');
            }
        }
    ],

    // private
    initComponent: function(){
        // this.addEvents({
// 
        // });
        
        this.tpl = new Ext.XTemplate(this.eventTpl);
        
        this.fbar = this.getFooterBarConfig();
        
        this.callParent(arguments);
    },
    
    getFooterBarConfig: function() {
        var cfg = ['->', {
                text: this.okButtonText,
                itemId: this.id + '-ok-btn',
                disabled: false,
                handler: this.onOk,
                scope: this
            }];
        
        return cfg;
    },
    
    // getFormItemConfigs: function() {
        // var items = [{
            // xtype: 'textfield',
            // itemId: this.id + '-title',
            // name: Extensible.calendar.data.EventMappings.Title.name,
            // fieldLabel: this.titleLabelText,
            // anchor: '100%'
        // },{
            // xtype: 'extensible.daterangefield',
            // itemId: this.id + '-dates',
            // name: 'dates',
            // anchor: '95%',
            // singleLine: true,
            // fieldLabel: this.datesLabelText
        // }];
//         
        // if(this.calendarStore){
            // items.push({
                // xtype: 'extensible.calendarcombo',
                // itemId: this.id + '-calendar',
                // name: Extensible.calendar.data.EventMappings.CalendarId.name,
                // anchor: '100%',
                // fieldLabel: this.calendarLabelText,
                // store: this.calendarStore
            // });
        // }
//         
        // return items;
    // },

    // private
    afterRender: function(){
        this.callParent(arguments);
        
        this.el.addCls('ext-cal-event-win');
        
        this.initRefs();
    },
    
    initRefs: function() {
        // toolbar button refs
        this.okButton = this.down('#' + this.id + '-ok-btn');
        // this.deleteButton = this.down('#' + this.id + '-delete-btn');
        // this.cancelButton = this.down('#' + this.id + '-cancel-btn');
        // this.detailsButton = this.down('#' + this.id + '-details-btn');
//         
        // if (this.detailsButton) {
            // this.detailsButton.getEl().on('click', this.onEditDetailsClick, this);
        // }
//         
        // // form item refs
        // this.titleField = this.down('#' + this.id + '-title');
        // this.dateRangeField = this.down('#' + this.id + '-dates');
        // this.calendarField = this.down('#' + this.id + '-calendar');
    },
    
    /**
     * Shows the window, rendering it first if necessary, or activates it and brings it to front if hidden.
     * @param {Ext.data.Record/Object} o Either a {@link Ext.data.Record} if showing the form
     * for an existing event in edit mode, or a plain object containing a StartDate property (and
     * optionally an EndDate property) for showing the form in add mode.
     * @param {String/Element} animateTarget (optional) The target element or id from which the window should
     * animate while opening (defaults to null with no animation)
     * @return {Ext.Window} this
     */
    show: function(o, animateTarget){
        var me = this,
            EventMappings = Extensible.calendar.data.EventMappings,
            form, rec;
        
        // Work around the CSS day cell height hack needed for initial render in IE8/strict:
        me.animateTarget = (Ext.isIE8 && Ext.isStrict) ? null : animateTarget;

        me.callParent([me.animateTarget, function(){
            me.okButton.focus(false, 100);
        }, me]);
        
        this.tpl.overwrite(this.body, o.data);
        
        // Only show the delete button if the data includes an EventID, otherwise
        // we're adding a new record
        // me.deleteButton[o.data && o.data[EventMappings.EventId.name] ? 'show' : 'hide']();
//         
        // if (o.data) {
            // rec = o;
            // me.setTitle(rec.phantom ? me.titleTextAdd : me.titleTextEdit);
            // form.loadRecord(rec);
        // }
        // else {
            // me.setTitle(me.titleTextAdd);
// 
            // var start = o[EventMappings.StartDate.name],
                // end = o[EventMappings.EndDate.name] || Extensible.Date.add(start, {hours: 1});
//                 
            // rec = Ext.create('Extensible.calendar.data.EventModel');
//             
            // rec.data[EventMappings.StartDate.name] = start;
            // rec.data[EventMappings.EndDate.name] = end;
//             
            // rec.data[EventMappings.IsAllDay.name] = !!o[EventMappings.IsAllDay.name] ||
                // (start.getDate() !== Extensible.Date.add(end, {millis: 1}).getDate());
//             
            // rec.data[EventMappings.CalendarId.name] = me.calendarStore ?
                    // me.calendarStore.getAt(0).data[Extensible.calendar.data.CalendarMappings.CalendarId.name] : '';
//             
            // if (EventMappings.Duration) {
                // rec.data[EventMappings.Duration.name] = Extensible.Date.diff(start, end,
                    // Extensible.calendar.data.EventModel.resolution);
            // }
//             
            // form.reset();
            // form.loadRecord(rec);
        // }
//         
        // if (EventMappings.RInstanceStartDate) {
            // rec.data[EventMappings.RInstanceStartDate.name] = rec.getStartDate();
        // }
//         
        // me.dateRangeField.setValue(rec.data);
        // me.activeRecord = rec;
//         
        // // Using setValue() results in dirty fields, so we reset the field state
        // // after loading the form so that the current values are the "original" values
        // form.getFields().each(function(item) {
            // item.resetOriginalValue();
        // });
        
        return me;
    },
    
    onOk: function() {
        this.hide();
    }
    
    // private
    // cleanup: function(hide){
        // if (this.activeRecord) {
            // this.activeRecord.reject();
        // }
        // delete this.activeRecord;
//         
        // if (hide===true) {
            // // Work around the CSS day cell height hack needed for initial render in IE8/strict:
            // //var anim = afterDelete || (Ext.isIE8 && Ext.isStrict) ? null : this.animateTarget;
            // this.hide();
        // }
    // },
    
    // private
    // onSave: function(){
        // var me = this,
            // form = me.formPanel.form,
            // originalHasRecurrence = me.activeRecord.isRecurring();
//         
        // if (!form.isDirty() && !me.allowDefaultAdd) {
            // me.onCancel();
            // return;
        // }
        // if (!form.isValid()) {
            // return;
        // }
//         
        // if (!me.updateRecord(me.activeRecord)) {
            // me.onCancel();
            // return;
        // }
//         
        // if (me.activeRecord.phantom) {
            // me.fireEvent('eventadd', me, me.activeRecord, me.animateTarget);
        // }
        // else {
            // if (originalHasRecurrence) {
                // // We only need to prompt when editing an existing recurring event. If a normal
                // // event is edited to make it recurring just do a standard update.
                // me.onRecurrenceUpdate();
            // }
            // else {
                // me.fireEvent('eventupdate', me, me.activeRecord, me.animateTarget);
            // }
        // }
    // },
//     
    // // private
    // onRecurrenceUpdate: function() {
        // Extensible.form.recurrence.RangeEditWindow.prompt({
            // callback: this.onRecurrenceEditModeSelected,
            // scope: this
        // });
    // },
//     
    // // private
    // onRecurrenceEditModeSelected: function(editMode) {
        // var me = this;
//         
        // if (editMode) {
            // me.activeRecord.data[Extensible.calendar.data.EventMappings.REditMode.name] = editMode;
            // me.fireEvent('eventupdate', me, me.activeRecord, me.animateTarget);
        // }
    // },
//     
    // // private
    // onDelete: function() {
        // this.fireEvent('eventdelete', this, this.activeRecord, this.animateTarget);
    // }
});