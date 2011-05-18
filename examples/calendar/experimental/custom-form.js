
var CPanel = Ext.ensible.cal.CalendarPanel;
CPanel.prototype.initComponent = CPanel.prototype.initComponent.createSequence(function(){
    this.add({
        xtype: 'form',
        id: 'cal-admin-form',
        border: false,
        bodyStyle: 'padding:25px;',
        defaultType: 'textfield',
        items: [{
            fieldLabel: 'Foo',
            anchor: '90%'
        },{
            fieldLabel: 'Bar',
            anchor: '90%'
        }],
        fbar: [{
            text: 'Save',
            handler: function(){
                alert('Saved');
                this.hideAdminForm();
            },
            scope: this
        },{
            text: 'Cancel',
            handler: function(){
                Ext.getCmp('cal-admin-form').getForm().reset();
                this.hideAdminForm();
            },
            scope: this
        }]
    });
});

Ext.override(CPanel, {
    showAdminForm: function(){
        this.preAdminView = this.layout.activeItem.id;
        this.setActiveView('cal-admin-form');
        return this;
    },
    hideAdminForm: function(){
        if(this.preAdminView){
            this.setActiveView(this.preAdminView);
            delete this.preAdminView;
        }
        return this;
    },
    setActiveView: function(id){
        var l = this.layout,
            tb = this.getTopToolbar();
            
        l.setActiveItem(id);
        this.activeView = l.activeItem;
        
        // Add the custom form to this check so the toolbar will be
        // hidden and the date-specific calls below will be skipped
        // since this is not a CalendarView subclass
        if(id == this.id+'-edit' || id == 'cal-admin-form'){
            if(tb){
                tb.hide();
            }
            this.doLayout();
        }
        else{
            if(id !== this.preEditView){
                l.activeItem.setStartDate(this.startDate, true);
            }
            if(tb){
               tb.show();
           }
           this.updateNavState();
        }
        this.fireViewChange();
    }
})

Ext.onReady(function(){
    
    var eventStore = new Ext.ensible.sample.MemoryEventStore({
        // defined in data/events.js
        data: Ext.ensible.sample.EventData
    });
    
    var cp = new Ext.ensible.cal.CalendarPanel({
        eventStore: eventStore,
        renderTo: 'cal',
        title: 'Basic Calendar',
        width: 700,
        height: 500
    });
    
    // This could be anywhere within the UI, but we'll just stick
    // it onto the end of the toolbar for convenience
    cp.getTopToolbar().add({
        text: 'Admin',
        handler: function(){
            this.showAdminForm();
        },
        scope: cp
    });
});