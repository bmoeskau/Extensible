Ext.ns('Ext.ensible.ux.cal');
/**
 * @class Ext.ensible.ux.cal.EventEditWindow
 * @extends Ext.Window
 * <p>A custom window containing a basic edit form used for quick editing of events.</p>
 * <p>This window also provides custom events specific to the calendar so that other calendar components can be easily
 * notified when an event has been edited via this component.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.ux.cal.EventEditWindow = Ext.extend(Ext.Window, {
    titleTextAdd: 'Add Event',
    titleTextEdit: 'Edit Event',
    width: 600,
    border: true,
    closeAction: 'hide',
    modal: false,
    resizable: false,
    buttonAlign: 'left',
    labelWidth: 65,
    savingMessage: 'Saving changes...',
    deletingMessage: 'Deleting event...',
    
    // private
	newId: 10000,
	
    // private
    initComponent: function(){
        this.addEvents({
            /**
             * @event eventadd
             * Fires after a new event is added
             * @param {Ext.ensible.ux.cal.EventEditWindow} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was added
             * @param {Ext.Element} el The target element
             */
            eventadd: true,
            /**
             * @event eventupdate
             * Fires after an existing event is updated
             * @param {Ext.ensible.ux.cal.EventEditWindow} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was updated
             * @param {Ext.Element} el The target element
             */
            eventupdate: true,
            /**
             * @event eventdelete
             * Fires after an event is deleted
             * @param {Ext.ensible.ux.cal.EventEditWindow} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was deleted
             * @param {Ext.Element} el The target element
             */
            eventdelete: true,
            /**
             * @event eventcancel
             * Fires after an event add/edit operation is canceled by the user and no store update took place
             * @param {Ext.ensible.ux.cal.EventEditWindow} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was canceled
             * @param {Ext.Element} el The target element
             */
            eventcancel: true,
            /**
             * @event editdetails
             * Fires when the user selects the option in this window to continue editing in the detailed edit form
             * (by default, an instance of {@link Ext.ensible.cal.EventEditForm}. Handling code should hide this window
             * and transfer the current event record to the appropriate instance of the detailed form by showing it
             * and calling {@link Ext.ensible.cal.EventEditForm#loadRecord loadRecord}.
             * @param {Ext.ensible.ux.cal.EventEditWindow} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} that is currently being edited
             * @param {Ext.Element} el The target element
             */
            editdetails: true
        });
        
        this.fbar = [{
            xtype: 'tbtext', text: '<a href="#" class="tblink">Edit Details...</a>'
        },'->',{
            text:'Save', disabled:false, handler:this.onSave, scope:this
        },{
            id:this.id+'-delete-btn', text:'Delete', disabled:false, handler:this.onDelete, scope:this, hideMode:'offsets'
        },{
            text:'Cancel', disabled:false, handler:this.onCancel, scope:this
        }];
        
        Ext.ensible.ux.cal.EventEditWindow.superclass.initComponent.call(this);
    },
    
    // private
    onRender : function(ct, position){
        this.deleteBtn = Ext.getCmp(this.id+'-delete-btn');
        
        this.titleField = new Ext.form.TextField({
            name: Ext.ensible.cal.EventMappings.Title.name,
            fieldLabel: 'Title',
            anchor: '100%'
        });
        this.dateRangeField = new Ext.ensible.cal.DateRangeField({
            anchor: '100%',
            fieldLabel: 'When'
        });
        
        var items = [this.titleField, this.dateRangeField];
        
        if(this.calendarStore){
            this.calendarField = new Ext.ensible.cal.CalendarPicker({
                name: Ext.ensible.cal.EventMappings.CalendarId.name,
                anchor: '100%',
                store: this.calendarStore
            });
            items.push(this.calendarField);
        }
        
        this.formPanel = new Ext.FormPanel({
            labelWidth: this.labelWidth,
            frame: false,
            bodyBorder: false,
            border: false,
            items: items
        });
        
        this.add(this.formPanel);
        
        Ext.ensible.ux.cal.EventEditWindow.superclass.onRender.call(this, ct, position);
    },

    // private
    afterRender: function(){
        Ext.ensible.ux.cal.EventEditWindow.superclass.afterRender.call(this);
		
		this.el.addClass('ext-cal-event-win');
        this.el.select('.tblink').on('click', this.onEditDetailsClick, this);
    },
    
    // private
    onEditDetailsClick: function(e){
        e.stopEvent();
        this.updateRecord();
        this.fireEvent('editdetails', this, this.activeRecord, this.animateTarget);
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
		// Work around the CSS day cell height hack needed for initial render in IE8/strict:
		var anim = (Ext.isIE8 && Ext.isStrict) ? null : animateTarget;

		Ext.ensible.ux.cal.EventEditWindow.superclass.show.call(this, anim, function(){
            this.titleField.focus(false, 100);
        });
        this.deleteBtn[o.data && o.data[Ext.ensible.cal.EventMappings.EventId.name] ? 'show' : 'hide']();
        
        var rec, f = this.formPanel.form;

        if(o.data){
            rec = o;
			this.isAdd = !!rec.data[Ext.ensible.cal.EventMappings.IsNew.name];
			if(this.isAdd){
				// Enable adding the default record that was passed in
				// if it's new even if the user makes no changes 
				rec.markDirty();
				this.setTitle(this.titleTextAdd);
			}
			else{
				this.setTitle(this.titleTextEdit);
			}
            
            f.loadRecord(rec);
        }
        else{
			this.isAdd = true;
            this.setTitle(this.titleTextAdd);

            var M = Ext.ensible.cal.EventMappings,
                eventId = M.EventId.name,
                start = o[M.StartDate.name],
                end = o[M.EndDate.name] || start.add('h', 1);
                
            rec = new Ext.ensible.cal.EventRecord();
            rec.data[M.EventId.name] = this.newId++;
            rec.data[M.StartDate.name] = start;
            rec.data[M.EndDate.name] = end;
            rec.data[M.IsAllDay.name] = !!o[M.IsAllDay.name] || start.getDate() != end.clone().add(Date.MILLI, 1).getDate();
            rec.data[M.IsNew.name] = true;
            
            f.reset();
            f.loadRecord(rec);
        }
        
        if(this.calendarStore){
            this.calendarField.setValue(rec.data[Ext.ensible.cal.EventMappings.CalendarId.name]);
        }
        this.dateRangeField.setValue(rec.data);
        this.activeRecord = rec;
        
		return this;
    },
    
    // private
    roundTime: function(dt, incr){
        incr = incr || 15;
        var m = parseInt(dt.getMinutes());
        return dt.add('mi', incr - (m % incr));
    },
    
    // private
    onCancel: function(){
    	this.cleanup(true);
		this.fireEvent('eventcancel', this, this.animateTarget);
    },

    // private
    cleanup: function(hide){
        if(this.activeRecord && this.activeRecord.dirty){
            this.activeRecord.reject();
        }
        delete this.activeRecord;
		
        if(hide===true){
			// Work around the CSS day cell height hack needed for initial render in IE8/strict:
			//var anim = afterDelete || (Ext.isIE8 && Ext.isStrict) ? null : this.animateTarget;
            this.hide();
        }
    },
    
    // private
    updateRecord: function(){
        var f = this.formPanel.form,
            dates = this.dateRangeField.getValue(),
            M = Ext.ensible.cal.EventMappings;
            
        f.updateRecord(this.activeRecord);
        this.activeRecord.set(M.StartDate.name, dates[0]);
        this.activeRecord.set(M.EndDate.name, dates[1]);
        this.activeRecord.set(M.IsAllDay.name, dates[2]);
        if(this.calendarStore){
            this.activeRecord.set(M.CalendarId.name, this.calendarField.getValue());
        }
    },
    
    // private
    onSave: function(){
        if(!this.formPanel.form.isValid()){
            return;
        }
        this.updateRecord();
		
		if(!this.activeRecord.dirty){
			this.onCancel();
			return;
		}
		
		this.fireEvent(this.isAdd ? 'eventadd' : 'eventupdate', this, this.activeRecord, this.animateTarget);
    },
    
    // private
    onDelete: function(){
		this.fireEvent('eventdelete', this, this.activeRecord, this.animateTarget);
    }
});