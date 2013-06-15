Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        "Extensible": "../../src",
        "Extensible.example": ".."
    }
});
Ext.require([
    'Ext.Ajax',
    'Ext.data.ArrayStore',
    'Ext.form.field.ComboBox',
    'Ext.window.MessageBox',
    'Extensible.calendar.data.MemoryEventStore',
    'Extensible.calendar.CalendarPanel',
    'Extensible.example.calendar.data.Events',
    'Extensible.calendar.gadget.CalendarListPanel'
]);

Ext.onReady(function() {
    Ext.QuickTips.init();
    
    var calendarPanel, 
        locale = 'English (US)';
    
    var localeStore = Ext.create('Ext.data.ArrayStore', {
        fields: ['code', 'desc'],
        data : [
            ['ca', 'Catalan'],
            ['zh_CN', 'Chinese (Simplified)'],
            ['zh_TW', 'Chinese (Traditional)'],
            ['hr', 'Croatian'],
            ['cs', 'Czech'],
            ['da', 'Danish'],
            ['nl', 'Dutch'],
            ['en', 'English (US)'],
            ['fr', 'French (France)'],
            ['de', 'German'],
            ['it', 'Italian'],
            ['pl', 'Polish'],
            ['pt_BR', 'Portuguese (Brazil)'],
            ['pt_PT', 'Portuguese (Portugal)'],
            ['ro', 'Romanian'],
            ['es', 'Spanish (Spain)'],
            ['sv_SE', 'Swedish']
        ]
    });
    
    var localeCombo = Ext.create('Ext.form.field.ComboBox', {
        renderTo: 'locales',
        store: localeStore,
        displayField: 'desc',
        valueField: 'code',
        typeAhead: true,
        queryMode: 'local',
        triggerAction: 'all',
        emptyText: 'Select a locale...',
        selectOnFocus: true,
        value: 'sv_SE',
        listeners: {
            'select': {
                fn: function(cbo, rec){
                    calendarPanel.getEl().mask('Loading '+rec.data.desc+'...');
                    loadLocale(rec.data.code);
                    locale = rec.data.desc;
                }
            }
        }
    });
    
    var doLoad = function(url, successFn){
        Ext.Ajax.request({
            url: url,
            disableCaching: false,
            success: successFn,
            failure: function(){
                Ext.Msg.alert('Failure', 'Failed to load locale file.');
                renderUI();
            }
        });
    };
    
    var loadLocale = function(code){
        doLoad('ext-locales/ext-lang-'+code+'.js', function(resp, opts){
            eval(resp.responseText); // apply the Ext locale overrides
            doLoad('../../src/locale/extensible-lang-'+code+'.js', function(resp, opts){
                eval(resp.responseText); // apply the Extensible locale overrides
                renderUI();
            });
        });
    };
    
    var renderUI = function() {
        if(calendarPanel){
            Ext.destroy(calendarPanel);
        }
        calendarPanel = Ext.create('Extensible.calendar.CalendarPanel', {
            id: 'locale-calendar',
            renderTo: 'cal',
            title: 'Localized Calendar: ' + locale,
            width: 800,
            height: 600,
            multiWeekViewCfg: {
                weekCount: 3
            },
            showMultiDayView: true,
            multiDayViewCfg: {
                dayCount: 5
            },
            showAgendaView: true,
            showListView: true,
            listViewCfg: {
                dateRangeDefault: '3months',
                groupBy: 'month'
            },
            activeItem: 4, // default to month view
            eventStore: Ext.create('Extensible.calendar.data.MemoryEventStore', {
                // defined in ../data/Events.js
                data: Ext.create('Extensible.example.calendar.data.Events')
            })
        });
    };
    
    // default to Swedish, just for fun
    loadLocale('sv_SE');
});
