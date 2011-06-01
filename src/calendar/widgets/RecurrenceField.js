/* @private
 * Currently not used
 * Rrule info: http://www.kanzaki.com/docs/ical/rrule.html
 */
Ext.define('Ext.ensible.cal.RecurrenceField', {
    extend: 'Ext.form.Field',
    alias: 'widget.recurrencefield',
    
    fieldLabel: 'Repeats',
    startDate: Ext.Date.clearTime(new Date()),
    enableFx: true,
    
    initComponent : function(){
        this.callParent(arguments);
        
        if(!this.height){
            this.autoHeight = true;
        }
    },
    
    onRender: function(ct, position){
        if(!this.el){
            this.frequencyCombo = new Ext.ensible.cal.RecurrenceCombo({
                id: this.id+'-frequency',
                listeners: {
                    'recurrencechange': {
                        fn: this.showOptions,
                        scope: this
                    }
                }
            });
            if(this.fieldLabel){
                this.frequencyCombo.fieldLabel = this.fieldLabel;
            }
            
            this.innerCt = new Ext.Container({
                cls: 'extensible-recur-inner-ct',
                items: []
            });
            this.fieldCt = new Ext.Container({
                autoEl: {id:this.id}, //make sure the container el has the field's id
                cls: 'extensible-recur-ct',
                renderTo: ct,
                items: [this.frequencyCombo, this.innerCt]
            });
            
            this.fieldCt.ownerCt = this;
            this.innerCt.ownerCt = this.fieldCt;
            this.el = this.fieldCt.getEl();
            this.items = new Ext.util.MixedCollection();
            this.items.addAll(this.initSubComponents());
        }
        this.callParent(arguments);
    },
    
//    afterRender : function(){
//        this.callParent(arguments);
//        this.setStartDate(this.startDate);
//    },
    
    // private
    initValue : function(){
        this.setStartDate(this.startDate);
        
        if(this.value !== undefined){
            this.setValue(this.value);
        }
        else if(this.frequency !== undefined){
            this.setValue('FREQ='+this.frequency);
        }
        else{
            this.setValue('NONE');
        }
        this.originalValue = this.getValue();
    },
    
    showOptions : function(o){
        var layoutChanged = false, unit = 'day';
        
        if(o != 'NONE'){
            this.hideSubPanels();
        }
        this.frequency = o;
        
        switch(o){
            case 'DAILY':
                layoutChanged = this.showSubPanel(this.repeatEvery);
                layoutChanged |= this.showSubPanel(this.until);
                break;
                
            case 'WEEKLY':
                layoutChanged = this.showSubPanel(this.repeatEvery);
                layoutChanged |= this.showSubPanel(this.weekly);
                layoutChanged |= this.showSubPanel(this.until);
                unit = 'week';
                break;
                
            case 'MONTHLY':
                layoutChanged = this.showSubPanel(this.repeatEvery);
                layoutChanged |= this.showSubPanel(this.monthly);
                layoutChanged |= this.showSubPanel(this.until);
                unit = 'month';
                break;
                
            case 'YEARLY':
                layoutChanged = this.showSubPanel(this.repeatEvery);
                layoutChanged |= this.showSubPanel(this.yearly);
                layoutChanged |= this.showSubPanel(this.until);
                unit = 'year';
                break;
            
            default:
                // case NONE
                this.hideInnerCt();
                return; 
        }
        
        if(layoutChanged){
            this.innerCt.doLayout();
        }
        
        this.showInnerCt();
        this.repeatEvery.updateLabel(unit);
    },
    
    showSubPanel : function(p){
        if (p.rendered) {
            p.show();
            return false;
        }
        else{
            if(this.repeatEvery.rendered){
                // make sure weekly/monthly options show in the middle
                p = this.innerCt.insert(1, p);
            }
            else{
                p = this.innerCt.add(p);
            }
            p.show();
            return true;
        }
    },
    
    showInnerCt: function(){
        if(!this.innerCt.isVisible()){
            if(this.enableFx && Ext.enableFx){
                this.innerCt.getPositionEl().slideIn('t', {
                    duration: .3
                });
            }
            else{
                this.innerCt.show();
            }
        }
    },
    
    hideInnerCt: function(){
        if(this.innerCt.isVisible()){
            if(this.enableFx && Ext.enableFx){
                this.innerCt.getPositionEl().slideOut('t', {
                    duration: .3,
                    easing: 'easeIn',
                    callback: this.hideSubPanels,
                    scope: this
                });
            }
            else{
                this.innerCt.hide();
                this.hideSubPanels();
            }
        }
    },
    
    setStartDate : function(dt){
        this.items.each(function(p){
            p.setStartDate(dt);
        });
    },
    
    getValue : function(){
        if(!this.rendered) {
            return this.value;
        }
        if(this.frequency=='NONE'){
            return '';
        }
        var value = 'FREQ='+this.frequency;
        this.items.each(function(p){
            if(p.isVisible()){
                value += p.getValue();
            }
        });
        return value;
    },
    
    setValue : function(v){
        this.value = v;
        
        if(v == null || v == '' || v == 'NONE'){
            this.frequencyCombo.setValue('NONE');
            this.showOptions('NONE');
            return this;
        }
        var parts = v.split(';');
        this.items.each(function(p){
            p.setValue(parts);
        });
        Ext.each(parts, function(p){
            if(p.indexOf('FREQ') > -1){
                var freq = p.split('=')[1];
                this.frequencyCombo.setValue(freq);
                this.showOptions(freq);
                return;
            }
        }, this);
        
        return this;
    },
    
    hideSubPanels : function(){
        this.items.each(function(p){
            p.hide();
        });
    },
    
    initSubComponents : function(){
        Ext.ensible.cal.recurrenceBase = Ext.extend(Ext.Container, {
            fieldLabel: ' ',
            labelSeparator: '',
            hideLabel: true,
            layout: 'table',
            anchor: '100%',
            startDate: this.startDate,

            //TODO: This is not I18N-able:
            getSuffix : function(n){
                if(!Ext.isNumber(n)){
                    return '';
                }
                switch (n) {
                    case 1:
                    case 21:
                    case 31:
                        return "st";
                    case 2:
                    case 22:
                        return "nd";
                    case 3:
                    case 23:
                        return "rd";
                    default:
                        return "th";
                }
            },
            
            //shared by monthly and yearly components:
            initNthCombo: function(cbo){
                var cbo = Ext.getCmp(this.id+'-combo'),
                    dt = this.startDate,
                    store = cbo.getStore(),
                    last = dt.getLastDateOfMonth().getDate(),
                    dayNum = dt.getDate(),
                    nthDate = Ext.Date.format(dt, 'jS') + ' day',
                    isYearly = this.id.indexOf('-yearly') > -1,
                    yearlyText = ' in ' + Ext.Date.format(dt, 'F'),
                    nthDayNum, nthDay, lastDay, lastDate, idx, data, s;
                    
                nthDayNum = Math.ceil(dayNum / 7);
                nthDay = nthDayNum + this.getSuffix(nthDayNum) + Ext.Date.format(dt, ' l');
                if(isYearly){
                    nthDate += yearlyText;
                    nthDay += yearlyText;
                }
                data = [[nthDate],[nthDay]];
                
                s = isYearly ? yearlyText : '';
                if(last-dayNum < 7){
                    data.push(['last '+Ext.Date.format(dt, 'l')+s]);
                }
                if(last == dayNum){
                    data.push(['last day'+s]);
                }
                
                idx = store.find('field1', cbo.getValue());
                store.removeAll();
                cbo.clearValue();
                store.loadData(data);
                
                if(idx > data.length-1){
                    idx = data.length-1;
                }
                cbo.setValue(store.getAt(idx > -1 ? idx : 0).data.field1);
                return this;
            },
            setValue:Ext.emptyFn
        });
        
        this.repeatEvery = new Ext.ensible.cal.recurrenceBase({
            id: this.id+'-every',
            layoutConfig: {
                columns: 3
            },
            items: [{
                xtype: 'label',
                text: 'Repeat every'
            },{
                xtype: 'numberfield',
                id: this.id+'-every-num',
                value: 1,
                width: 35,
                minValue: 1,
                maxValue: 99,
                allowBlank: false,
                enableKeyEvents: true,
                listeners: {
                    'keyup': {
                        fn: function(){
                            this.repeatEvery.updateLabel();
                        },
                        scope: this
                    }
                }
            },{
                xtype: 'label',
                id: this.id+'-every-label'
            }],
            setStartDate: function(dt){
                this.startDate = dt;
                this.updateLabel();
                return this;
            },
            getValue: function(){
                var v = Ext.getCmp(this.id+'-num').getValue();
                return v > 1 ? ';INTERVAL='+v : '';
            },
            setValue : function(v){
                var set = false, 
                    parts = Ext.isArray(v) ? v : v.split(';');
                
                Ext.each(parts, function(p){
                    if(p.indexOf('INTERVAL') > -1){
                        var interval = p.split('=')[1];
                        Ext.getCmp(this.id+'-num').setValue(interval);
                    }
                }, this);
                return this;
            },
            updateLabel: function(type){
                if(this.rendered){
                    var s = Ext.getCmp(this.id+'-num').getValue() == 1 ? '' : 's';
                    this.type = type ? type.toLowerCase() : this.type || 'day';
                    var lbl = Ext.getCmp(this.id+'-label');
                    if(lbl.rendered){
                        lbl.update(this.type + s + ' beginning ' + Ext.Date.format(this.startDate, 'l, F j'));
                    }
                }
                return this;
            },
            afterRender: function(){
                this.callParent(arguments);
                this.updateLabel();
            }
        });
            
        this.weekly = new Ext.ensible.cal.recurrenceBase({
            id: this.id+'-weekly',
            layoutConfig: {
                columns: 2
            },
            items: [{
                xtype: 'label',
                text: 'on:'
            },{
                xtype: 'checkboxgroup',
                id: this.id+'-weekly-days',
                items: [
                    {boxLabel: 'Sun', name: 'SU', id: this.id+'-weekly-SU'},
                    {boxLabel: 'Mon', name: 'MO', id: this.id+'-weekly-MO'},
                    {boxLabel: 'Tue', name: 'TU', id: this.id+'-weekly-TU'},
                    {boxLabel: 'Wed', name: 'WE', id: this.id+'-weekly-WE'},
                    {boxLabel: 'Thu', name: 'TH', id: this.id+'-weekly-TH'},
                    {boxLabel: 'Fri', name: 'FR', id: this.id+'-weekly-FR'},
                    {boxLabel: 'Sat', name: 'SA', id: this.id+'-weekly-SA'}
                ]
            }],
            setStartDate: function(dt){
                this.startDate = dt;
                this.selectToday();
                return this;
            },
            selectToday: function(){
                this.clearValue();
                var day = Ext.Date.format(this.startDate, 'D').substring(0,2).toUpperCase();
                Ext.getCmp(this.id + '-days').setValue(day, true);
            },
            clearValue: function(){
                Ext.getCmp(this.id + '-days').setValue([false, false, false, false, false, false, false]);
            },
            getValue: function(){
                var v = '', sel = Ext.getCmp(this.id+'-days').getValue();
                Ext.each(sel, function(chk){
                    if(v.length > 0){
                        v += ',';
                    }
                    v += chk.name;
                });
                var day = Ext.Date.format(this.startDate, 'D').substring(0,2).toUpperCase();
                return v.length > 0 && v != day ? ';BYDAY='+v : '';
            },
            setValue : function(v){
                var set = false, 
                    parts = Ext.isArray(v) ? v : v.split(';');
                
                this.clearValue();
                
                Ext.each(parts, function(p){
                    if(p.indexOf('BYDAY') > -1){
                        var days = p.split('=')[1].split(','),
                            vals = {};
                            
                        Ext.each(days, function(d){
                            vals[d] = true;
                        }, this);
                        
                        Ext.getCmp(this.id+'-days').setValue(vals);
                        return set = true;
                    }
                }, this);
                
                if(!set){
                    this.selectToday();
                }
                return this;
            }
        });
            
        this.monthly = new Ext.ensible.cal.recurrenceBase({
            id: this.id+'-monthly',
            layoutConfig: {
                columns: 3
            },
            items: [{
                xtype: 'label',
                text: 'on the'
            },{
                xtype: 'combo',
                id: this.id+'-monthly-combo',
                mode: 'local',
                width: 150,
                triggerAction: 'all',
                forceSelection: true,
                store: []
            },{
                xtype: 'label',
                text: 'of each month'
            }],
            setStartDate: function(dt){
                this.startDate = dt;
                this.initNthCombo();
                return this;
            },
            getValue: function(){
                var cbo = Ext.getCmp(this.id+'-combo'),
                    store = cbo.getStore(),
                    idx = store.find('field1', cbo.getValue()),
                    dt = this.startDate,
                    day = Ext.Date.format(dt, 'D').substring(0,2).toUpperCase();
                
                if (idx > -1) {
                    switch(idx){
                        case 0:  return ';BYMONTHDAY='+Ext.Date.format(dt, 'j');
                        case 1:  return ';BYDAY='+cbo.getValue()[0].substring(0,1)+day;
                        case 2:  return ';BYDAY=-1'+day;
                        default: return ';BYMONTHDAY=-1';
                    }
                }
                return '';
            }
        });
            
        this.yearly = new Ext.ensible.cal.recurrenceBase({
            id: this.id+'-yearly',
            layoutConfig: {
                columns: 3
            },
            items: [{
                xtype: 'label',
                text: 'on the'
            },{
                xtype: 'combo',
                id: this.id+'-yearly-combo',
                mode: 'local',
                width: 170,
                triggerAction: 'all',
                forceSelection: true,
                store: []
            },{
                xtype: 'label',
                text: 'each year'
            }],
            setStartDate: function(dt){
                this.startDate = dt;
                this.initNthCombo();
                return this;
            },
            getValue: function(){
                var cbo = Ext.getCmp(this.id+'-combo'),
                    store = cbo.getStore(),
                    idx = store.find('field1', cbo.getValue()),
                    dt = this.startDate,
                    day = Ext.Date.format(dt, 'D').substring(0,2).toUpperCase(),
                    byMonth = ';BYMONTH='+dt.format('n');
                
                if(idx > -1){
                    switch(idx){
                        case 0:  return byMonth;
                        case 1:  return byMonth+';BYDAY='+cbo.getValue()[0].substring(0,1)+day;
                        case 2:  return byMonth+';BYDAY=-1'+day;
                        default: return byMonth+';BYMONTHDAY=-1';
                    }
                }
                return '';
            }
        });
            
        this.until = new Ext.ensible.cal.recurrenceBase({
            id: this.id+'-until',
            untilDateFormat: 'Ymd\\T000000\\Z',
            layoutConfig: {
                columns: 5
            },
            items: [{
                xtype: 'label',
                text: 'and continuing'
            },{
                xtype: 'combo',
                id: this.id+'-until-combo',
                mode: 'local',
                width: 85,
                triggerAction: 'all',
                forceSelection: true,
                value: 'forever',
                store: ['forever', 'for', 'until'],
                listeners: {
                    'select': {
                        fn: function(cbo, rec){
                            var dt = Ext.getCmp(this.id+'-until-date');
                            if(rec.data.field1 == 'until'){
                                dt.show();
                                if (dt.getValue() == '') {
                                    dt.setValue(this.startDate.add(Date.DAY, 5));
                                    dt.setMinValue(this.startDate.clone().add(Date.DAY, 1));
                                }
                            }
                            else{
                                dt.hide();
                            }
                            if(rec.data.field1 == 'for'){
                                Ext.getCmp(this.id+'-until-num').show();
                                Ext.getCmp(this.id+'-until-endlabel').show();
                            }
                            else{
                                Ext.getCmp(this.id+'-until-num').hide();
                                Ext.getCmp(this.id+'-until-endlabel').hide();
                            }
                        },
                        scope: this
                    }
                }
            },{
                xtype: 'datefield',
                id: this.id+'-until-date',
                showToday: false,
                hidden: true
            },{
                xtype: 'numberfield',
                id: this.id+'-until-num',
                value: 5,
                width: 35,
                minValue: 1,
                maxValue: 99,
                allowBlank: false,
                hidden: true
            },{
                xtype: 'label',
                id: this.id+'-until-endlabel',
                text: 'occurrences',
                hidden: true
            }],
            setStartDate: function(dt){
                this.startDate = dt;
                return this;
            },
            getValue: function(){
                var dt = Ext.getCmp(this.id+'-date');
                if(dt.isVisible()){
                    return ';UNTIL='+Ext.String.format(dt.getValue(), this.untilDateFormat);
                }
                var ct = Ext.getCmp(this.id+'-num');
                if(ct.isVisible()){
                    return ';COUNT='+ct.getValue();
                }
                return '';
            },
            setValue : function(v){
                var set = false, 
                    parts = Ext.isArray(v) ? v : v.split(';');
                
                Ext.each(parts, function(p){
                    if(p.indexOf('COUNT') > -1){
                        var count = p.split('=')[1];
                        Ext.getCmp(this.id+'-combo').setValue('for');
                        Ext.getCmp(this.id+'-num').setValue(count).show();
                        Ext.getCmp(this.id+'-endlabel').show();
                    }
                    else if(p.indexOf('UNTIL') > -1){
                        var dt = p.split('=')[1];
                        Ext.getCmp(this.id+'-combo').setValue('until');
                        Ext.getCmp(this.id+'-date').setValue(Date.parseDate(dt, this.untilDateFormat)).show();
                        Ext.getCmp(this.id+'-endlabel').hide();
                    }
                }, this);
                return this;
            }
        });
        
        return [this.repeatEvery, this.weekly, this.monthly, this.yearly, this.until];
    }
});