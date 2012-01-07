/* @private
 * Currently not used
 * Rrule info: http://www.kanzaki.com/docs/ical/rrule.html
 */
Ext.define('Extensible.form.recurrence.Fieldset', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.extensible.recurrencefield',
    
    mixins: {
        field: 'Ext.form.field.Field'
    },
    
    requires: [
        'Ext.form.CheckboxGroup',
        'Ext.form.field.Display',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Checkbox',
        'Ext.layout.container.Card',
        'Extensible.form.recurrence.Combo'
    ],
    
    fieldLabel: 'Repeats',
    startDate: Ext.Date.clearTime(new Date()),
    enableFx: true,
    
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },
    
    initComponent : function() {
        var me = this;
        
        if (!me.height) {
            me.autoHeight = true;
        }
        
        me.items = [{
            xtype: 'extensible.recurrencecombo',
            hideLabel: true,
            id: this.id+'-frequency',
            listeners: {
                'recurrencechange': {
                    fn: this.showOptions,
                    scope: this
                }
            }
        },{
            xtype: 'container',
            autoHeight: true,
            layout: 'anchor',
            items: [{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {
                    margins: '0 5 0 0'
                },
                items: [{
                    xtype: 'displayfield',
                    value: 'Repeat every'
                },{
                    xtype: 'textfield',
                    width: 40
                },{
                    xtype: 'displayfield',
                    value: '(whatever)'
                }]
            },{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {
                    margins: '0 5 0 0'
                },
                items: [{
                    xtype: 'displayfield',
                    value: 'on:'
                },{
                    xtype: 'checkboxgroup',
                    flex: 1,
                    items: [
                        {boxLabel: 'Sun', inputValue: 'SU', name: this.id+'-weekly-SU'},
                        {boxLabel: 'Mon', inputValue: 'MO', name: this.id+'-weekly-MO'},
                        {boxLabel: 'Tue', inputValue: 'TU', name: this.id+'-weekly-TU'},
                        {boxLabel: 'Wed', inputValue: 'WE', name: this.id+'-weekly-WE'},
                        {boxLabel: 'Thu', inputValue: 'TH', name: this.id+'-weekly-TH'},
                        {boxLabel: 'Fri', inputValue: 'FR', name: this.id+'-weekly-FR'},
                        {boxLabel: 'Sat', inputValue: 'SA', name: this.id+'-weekly-SA'}
                    ]
                }]
            },{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {
                    margins: '0 5 0 0'
                },
                items: [{
                    xtype: 'displayfield',
                    value: 'on the'
                },{
                    xtype: 'combobox',
                    store: []
                },{
                    xtype: 'displayfield',
                    value: 'of each month'
                }]
            },{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {
                    margins: '0 5 0 0'
                },
                items: [{
                    xtype: 'displayfield',
                    value: 'on the'
                },{
                    xtype: 'combobox',
                    store: []
                },{
                    xtype: 'displayfield',
                    value: 'each year'
                }]
            },{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {
                    margins: '0 5 0 0'
                },
                items: [{
                    xtype: 'displayfield',
                    value: 'and continuing'
                },{
                    xtype: 'combobox',
                    store: []
                }]
            }]
        }];
        
        me.callParent(arguments);
    },
    
    showOptions : function(o){
        // var layoutChanged = false,
            // unit = 'day';
//         
        // if(o != 'NONE'){
            // this.hideSubPanels();
        // }
        // this.frequency = o;
//         
        // switch(o){
            // case 'DAILY':
                // layoutChanged = this.showSubPanel(this.repeatEvery);
                // layoutChanged |= this.showSubPanel(this.until);
                // break;
//                 
            // case 'WEEKLY':
                // layoutChanged = this.showSubPanel(this.repeatEvery);
                // layoutChanged |= this.showSubPanel(this.weekly);
                // layoutChanged |= this.showSubPanel(this.until);
                // unit = 'week';
                // break;
//                 
            // case 'MONTHLY':
                // layoutChanged = this.showSubPanel(this.repeatEvery);
                // layoutChanged |= this.showSubPanel(this.monthly);
                // layoutChanged |= this.showSubPanel(this.until);
                // unit = 'month';
                // break;
//                 
            // case 'YEARLY':
                // layoutChanged = this.showSubPanel(this.repeatEvery);
                // layoutChanged |= this.showSubPanel(this.yearly);
                // layoutChanged |= this.showSubPanel(this.until);
                // unit = 'year';
                // break;
//             
            // default:
                // // case NONE
                // this.hideInnerCt();
                // return; 
        // }
//         
        // if(layoutChanged){
            // this.innerCt.doLayout();
        // }
//         
        // this.showInnerCt();
        // this.repeatEvery.updateLabel(unit);
    },
});