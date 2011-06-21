Ext.require([
    'Extensible.calendar.data.MemoryEventStore',
    'Extensible.calendar.CalendarPanel',
    'Extensible.example.calendar.data.Events'
]);

Ext.onReady(function() {

    var CPanel = Extensible.calendar.CalendarPanel;
    
    CPanel.prototype.initComponent = Ext.Function.createSequence(CPanel.prototype.initComponent, function() {
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
                handler: function() {
                    alert('Saved');
                    this.hideAdminForm();
                },
                scope: this
            },{
                text: 'Cancel',
                handler: function() {
                    Ext.getCmp('cal-admin-form').getForm().reset();
                    this.hideAdminForm();
                },
                scope: this
            }]
        });
    });
    
    Ext.override(CPanel, {
    
        showAdminForm: function() {
            this.preAdminView = this.layout.activeItem.id;
            this.setActiveView('cal-admin-form');
            return this;
        },
        
        hideAdminForm: function() {
            if(this.preAdminView) {
                this.setActiveView(this.preAdminView);
                delete this.preAdminView;
            }
            return this;
        },
        
        setActiveView: function(id) {
            var l = this.layout,
                tb = this.getDockedItems('toolbar')[0],
                // Add the custom form to this check so the toolbar will be
                // hidden and the date-specific calls below will be skipped
                // since this is not a CalendarView subclass
                isEditView = (id === this.id+'-edit' || id === 'cal-admin-form');
            
            // show/hide the toolbar first so that the layout will calculate the correct item size
            if (tb) {
                tb[isEditView ? 'hide' : 'show']();
            }
            
            l.setActiveItem(id);
            this.activeView = l.getActiveItem();
            
            if(!isEditView) {
               if(id !== this.preEditView) {
                    l.activeItem.setStartDate(this.startDate, true);
                }
               this.updateNavState();
            }
            this.fireViewChange();
        }
    });
    
    var eventStore = Ext.create('Extensible.calendar.data.MemoryEventStore', {
        // defined in ../data/Events.js
        data: Ext.create('Extensible.example.calendar.data.Events')
    });
    
    var cp = Ext.create('Extensible.calendar.CalendarPanel', {
        eventStore: eventStore,
        renderTo: 'cal',
        title: 'Basic Calendar',
        width: 700,
        height: 500
    });
    
    // This could be anywhere within the UI, but we'll just stick
    // it onto the end of the toolbar for convenience
    cp.getDockedItems('toolbar')[0].add({
        text: 'Admin',
        handler: function() {
            this.showAdminForm();
        },
        scope: cp
    });
});