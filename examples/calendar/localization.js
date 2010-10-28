Ext.ensible.LocaleSample = function(){
    return {
        init: function(){
            Ext.QuickTips.init();
            
            var localeStore = new Ext.data.ArrayStore({
                fields: ['code', 'locale'],
                data : [
                    ['en', 'English (US)'],
                    ['fr', 'French (France)']
                ]
            });
            
            var localeCombo = new Ext.form.ComboBox({
                renderTo: 'locales',
                store: localeStore,
                displayField: 'locale',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                emptyText: 'Select a locale...',
                selectOnFocus: true,
                listeners: {
                    'select': {
                        fn: function(cbo, rec, idx){
                            this.currentLocale = rec.data.code; 
                            this.loadLocale();
                        },
                        scope: this
                    }
                }
            });
            
            this.renderUI();
        },
        
        includeExtLocale: function(){
            var head = document.getElementsByTagName('head')[0],
                script = document.createElement('script');
            
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', 'http://extjs.cachefly.net/ext-3.2.0/src/locale/ext-lang-'+this.currentLocale+'.js');
            head.appendChild(script);
        },
        
        loadLocale: function(){
            this.includeExtLocale();
            
            Ext.Ajax.request({
                url: '../../src/locale/extensible-lang-'+this.currentLocale+'.js',
                disableCaching: false,
                success: this.onSuccess,
                failure: this.onFailure,
                scope: this 
            });
        },
        
        onSuccess: function(response, opts) {
            eval(response.responseText); // apply the locale overrides
            this.renderUI();
        },
        
        onFailure: function() {
            Ext.Msg.alert('Failure', 'Failed to load locale file.');
            this.renderUI();
        },
        
        renderUI: function() {
            var today = new Date().clearTime();
            var eventStore = new Ext.data.JsonStore({
                id: 'eventStore',
                data: [{
                    "id":100,
                    "title":"Vacation",
                    // this event spans multiple days so it will automatically be rendered as all-day
                    "start":today.add(Date.DAY, -5).add(Date.HOUR, 10),
                    "end":today.add(Date.DAY, 5).add(Date.HOUR, 15),
                    "notes":"Have fun"
                },{
                    "id":101,
                    "title":"Lunch with Matt",
                    "start":today.add(Date.HOUR, 11).add(Date.MINUTE, 30),
                    "end":today.add(Date.HOUR, 13),
                    "loc":"Chuy's!",
                    "url":"http://chuys.com",
                    "notes":"Order the queso",
                    "rem":"15"
                },{
                    "id":102,
                    "title":"Brian's birthday",
                    "start":today.add(Date.HOUR, 15),
                    "end":today.add(Date.HOUR, 15),
                    "ad":true // explicit all-day event
                },{
                    // id, start and end dates are the only truly required data elements to render an event:
                    "id":103,
                    "start":today.add(Date.HOUR, 15),
                    "end":today.add(Date.HOUR, 15)
                }],
                proxy: new Ext.data.MemoryProxy(),
                fields: Ext.ensible.cal.EventRecord.prototype.fields.getRange(),
                sortInfo: {
                    field: Ext.ensible.cal.EventMappings.StartDate.name,
                    direction: 'ASC'
                }
            });
            
            if(this.calendar){
                Ext.destroy(this.calendar);
            }

            this.calendar = new Ext.ensible.cal.CalendarPanel({
                eventStore: eventStore,
                renderTo: 'cal',
                title: 'Localized Calendar',
                width: 800,
                height: 600
            });
        }
    }
}();

Ext.onReady(Ext.ensible.LocaleSample.init, Ext.ensible.LocaleSample);
