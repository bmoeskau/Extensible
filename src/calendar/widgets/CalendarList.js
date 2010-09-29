/**
 * @class Ext.ensible.cal.CalendarList
 * @extends Ext.Panel
 * <p>This is a {@link Ext.Panel panel} subclass that renders a list of available calendars
 * @constructor
 * @param {Object} config The config object
 * @xtype calendarpanel
 */
Ext.ensible.cal.CalendarList = Ext.extend(Ext.Panel, {
    title: 'Calendars',
    collapsible: true,
    autoHeight: true,
    layout: 'fit',
    width: 100, // this should be overridden by this container's layout
    
    // private
    initComponent: function(){
        this.addClass('x-cal-list');
        Ext.ensible.cal.CalendarList.superclass.initComponent.call(this);
    },
    
    getListTemplate : function(){
        if(!this.tpl){
            this.tpl = new Ext.XTemplate(
                '<tpl for=".">',
                    '<div id="{' + Ext.ensible.cal.CalendarMappings.CalendarId.name + '}" class="{' + 
                    Ext.ensible.cal.CalendarMappings.StyleClass.name + '}">{' + 
                    Ext.ensible.cal.CalendarMappings.Title.name + '}</div>',
                '</tpl>'
            );
            this.tpl.compile();
        }
        return this.tpl;
    },
    
    refresh: function(){
        var data = [], i = 0, 
            recs = this.store.getRange(), 
            len = recs.length;
            
        for(; i < len; i++){
            data[data.length] = recs[i].data;
        }
        this.getListTemplate().overwrite(this.body, data);
    },
    
    // private
    onRender : function(ct, position){
        Ext.ensible.cal.CalendarList.superclass.onRender.call(this, ct, position);
        this.refresh();
    }
});

Ext.reg('extensible.calendarlist', Ext.ensible.cal.CalendarList);