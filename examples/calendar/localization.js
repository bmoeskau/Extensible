Ext.ensible.LocaleSample = function(){
    return {
        init: function(){
            Ext.QuickTips.init();
            
            this.localeStore = new Ext.data.ArrayStore({
                fields: ['code', 'desc'],
                data : [
                    ['ca', 'Catalan'],
                    ['zh_CN', 'Chinese (Simplified)'],
                    ['zh_TW', 'Chinese (Traditional)'],
                    ['hr', 'Croatian'],
                    ['cs', 'Czech'],
                    ['da', 'Danish'],
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
            
            this.localeCombo = new Ext.form.ComboBox({
                renderTo: 'locales',
                store: this.localeStore,
                displayField: 'desc',
                valueField: 'code',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                emptyText: 'Select a locale...',
                selectOnFocus: true,
                value: 'en',
                listeners: {
                    'select': {
                        fn: function(cbo, rec, idx){
                            this.calendar.getEl().mask('Loading '+rec.data.desc+'...');
                            this.loadLocale(rec.data.code);
                            this.locale = rec.data.desc;
                        },
                        scope: this
                    }
                }
            });
            
            this.renderUI();
        },
        
        doLoad: function(url, successFn){
            Ext.Ajax.request({
                url: url,
                disableCaching: false,
                success: successFn,
                failure: function(){
                    Ext.Msg.alert('Failure', 'Failed to load locale file.');
                    this.renderUI();
                },
                scope: this 
            });
        },
        
        loadLocale: function(code){
            this.doLoad('ext-locales/ext-lang-'+code+'.js', function(resp, opts){
                eval(resp.responseText); // apply the Ext locale overrides
                this.doLoad('../../src/locale/extensible-lang-'+code+'.js', function(resp, opts){
                    eval(resp.responseText); // apply the Extensible locale overrides
                    this.renderUI();
                });
            });
        },
        
        renderUI: function() {
            if(this.calendar){
                Ext.destroy(this.calendar);
            }
            this.calendar = new Ext.ensible.cal.CalendarPanel({
                id: 'locale-calendar',
                renderTo: 'cal',
                title: 'Localized Calendar: '+(this.locale || 'English (US)'),
                width: 800,
                height: 600,
                multiWeekViewCfg: {
                    weekCount: 3
                },
                showMultiDayView: true,
                multiDayViewCfg: {
                    dayCount: 5
                },
                eventStore: new Ext.ensible.sample.MemoryEventStore({
                    // defined in data/events.js
                    data: Ext.ensible.sample.EventData
                })
            });
        }
    }
}();

Ext.onReady(Ext.ensible.LocaleSample.init, Ext.ensible.LocaleSample);
