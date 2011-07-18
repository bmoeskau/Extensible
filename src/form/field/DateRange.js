/**
 * @class Extensible.form.field.DateRange
 * @extends Ext.form.Field
 * <p>A combination field that includes start and end dates and times, as well as an optional all-day checkbox.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Extensible.form.field.DateRange', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.extensible.daterangefield',
    
    requires: [
        'Ext.form.field.Date',
        'Ext.form.field.Time',
        'Ext.form.Label',
        'Ext.form.field.Checkbox',
        'Ext.layout.container.Column'
    ],
    
    /**
     * @cfg {String} toText
     * The text to display in between the date/time fields (defaults to 'to')
     */
    toText: 'to',
    /**
     * @cfg {String} allDayText
     * The text to display as the label for the all day checkbox (defaults to 'All day')
     */
    allDayText: 'All day',
    /**
     * @cfg {String/Boolean} singleLine
     * This value can be set explicitly to <code>true</code> or <code>false</code> to force the field to render on
     * one line or two lines respectively.  The default value is <code>'auto'</code> which means that the field will
     * calculate its container's width and compare it to {@link singleLineMinWidth} to determine whether to render 
     * on one line or two automatically.  Note that this only applies at render time -- once the field is rendered
     * the layout cannot be changed.
     */
    singleLine: 'auto',
    /**
     * @cfg {Number} singleLineMinWidth
     * If {@link singleLine} is set to 'auto' it will use this value to determine whether to render the field on one
     * line or two. This value is the approximate minimum width required to render the field on a single line, so if
     * the field's container is narrower than this value it will automatically be rendered on two lines.
     */
    singleLineMinWidth: 490,
    /**
     * @cfg {String} dateFormat
     * The date display format used by the date fields (defaults to 'n/j/Y') 
     */
    dateFormat: 'n/j/Y',
    
    layout: {
        type: 'hbox',
        defaultMargins: { top: 0, right: 5, bottom: 0, left: 0 }
    },
    
    // private
    initComponent: function() {
        var me = this;
        me.items = me.getFieldConfigs();
        me.addCls('ext-dt-range');
        
        // TODO: Replace this with singleLine config logic:
        me.height = 22;
        
        me.callParent(arguments);
        me.initRefs();
    },
    
    initRefs: function() {
        var me = this;
        me.startDate = me.down('#' + me.id + '-start-date');
        me.startTime = me.down('#' + me.id + '-start-time');
        me.endTime = me.down('#' + me.id + '-end-time');
        me.endDate = me.down('#' + me.id + '-end-date');
        me.allDay = me.down('#' + me.id + '-allday');
        me.toLabel = me.down('#' + me.id + '-to-label');
    },
    
    getFieldConfigs: function() {
        var me = this;
        return [
            me.getStartDateConfig(),
            me.getStartTimeConfig(),
            me.getDateSeparatorConfig(),
            me.getEndTimeConfig(),
            me.getEndDateConfig(),
            me.getAllDayConfig()
        ];
    },
    
    getStartDateConfig: function() {
        return {
            xtype: 'datefield',
            itemId: this.id + '-start-date',
            format: this.dateFormat,
            width: 100,
            listeners: {
                'change': {
                    fn: function(){
                        this.onFieldChange('date', 'start');
                    },
                    scope: this
                }
            }
        };
    },
    
    getStartTimeConfig: function() {
        return {
            xtype: 'timefield',
            itemId: this.id + '-start-time',
            hidden: this.showTimes === false,
            labelWidth: 0,
            hideLabel: true,
            format: Extensible.Date.use24HourTime ? 'G:i' : 'ga',
            width: 90,
            listeners: {
                'select': {
                    fn: function(){
                        this.onFieldChange('time', 'start');
                    },
                    scope: this
                }
            }
        };
    },
    
    getEndDateConfig: function() {
        return {
            xtype: 'datefield',
            itemId: this.id + '-end-date',
            format: this.dateFormat,
            hideLabel: true,
            width: 100,
            listeners: {
                'change': {
                    fn: function(){
                        this.onFieldChange('date', 'end');
                    },
                    scope: this
                }
            }
        };
    },
    
    getEndTimeConfig: function() {
        return {
            xtype: 'timefield',
            itemId: this.id + '-end-time',
            hidden: this.showTimes === false,
            labelWidth: 0,
            hideLabel: true,
            format: Extensible.Date.use24HourTime ? 'G:i' : 'ga',
            width: 90,
            listeners: {
                'select': {
                    fn: function(){
                        this.onFieldChange('time', 'end');
                    },
                    scope: this
                }
            }
        };
    },
    
    getAllDayConfig: function() {
        return {
            xtype: 'checkbox',
            itemId: this.id + '-allday',
            hidden: this.showTimes === false || this.showAllDay === false,
            boxLabel: this.allDayText,
            margins: { top: 2, right: 5, bottom: 0, left: 0 },
            handler: this.onAllDayChange,
            scope: this
        };
    },
    
    onAllDayChange: function(chk, checked) {
        this.startTime.setVisible(!checked);
        this.endTime.setVisible(!checked);
    },
    
    getDateSeparatorConfig: function() {
        return {
            xtype: 'label',
            itemId: this.id + '-to-label',
            text: this.toText,
            margins: { top: 4, right: 5, bottom: 0, left: 0 }
        };
    },
    
    isSingleLine: function() {
        var me = this;
        
        if (me.calculatedSingleLine === undefined) {
            if(me.singleLine == 'auto'){
                var ownerCtEl = me.ownerCt.getEl(),
                    w = me.ownerCt.getWidth() - ownerCtEl.getPadding('lr'),
                    el = ownerCtEl.down('.x-panel-body');
                    
                if(el){
                    w -= el.getPadding('lr');
                }
                
                el = ownerCtEl.down('.x-form-item-label')
                if(el){
                    w -= el.getWidth() - el.getPadding('lr');
                }
                singleLine = w <= me.singleLineMinWidth ? false : true;
            }
            else {
                me.calculatedSingleLine = me.singleLine !== undefined ? me.singleLine : true;
            }
        }
        return me.calculatedSingleLine;
    },
    
    // private
//    onRender: function(ct, position){
//        if(!this.el){
//            this.startDate = Ext.create('Ext.form.DateField', {
//                id: this.id+'-start-date',
//                format: this.dateFormat,
//                width:100,
//                listeners: {
//                    'change': {
//                        fn: function(){
//                            this.onFieldChange('date', 'start');
//                        },
//                        scope: this
//                    }
//                }
//            });
//            this.startTime = Ext.create('Ext.form.TimeField', {
//                id: this.id+'-start-time',
//                hidden: this.showTimes === false,
//                labelWidth: 0,
//                hideLabel:true,
//                width:90,
//                listeners: {
//                    'select': {
//                        fn: function(){
//                            this.onFieldChange('time', 'start');
//                        },
//                        scope: this
//                    }
//                }
//            });
//            this.endTime = Ext.create('Ext.form.TimeField', {
//                id: this.id+'-end-time',
//                hidden: this.showTimes === false,
//                labelWidth: 0,
//                hideLabel:true,
//                width:90,
//                listeners: {
//                    'select': {
//                        fn: function(){
//                            this.onFieldChange('time', 'end');
//                        },
//                        scope: this
//                    }
//                }
//            })
//            this.endDate = Ext.create('Ext.form.DateField', {
//                id: this.id+'-end-date',
//                format: this.dateFormat,
//                hideLabel:true,
//                width:100,
//                listeners: {
//                    'change': {
//                        fn: function(){
//                            this.onFieldChange('date', 'end');
//                        },
//                        scope: this
//                    }
//                }
//            });
//            this.allDay = Ext.create('Ext.form.Checkbox', {
//                id: this.id+'-allday',
//                hidden: this.showTimes === false || this.showAllDay === false,
//                boxLabel: this.allDayText,
//                handler: function(chk, checked){
//                    this.startTime.setVisible(!checked);
//                    this.endTime.setVisible(!checked);
//                },
//                scope: this
//            });
//            this.toLabel = Ext.create('Ext.form.Label', {
//                xtype: 'label',
//                id: this.id+'-to-label',
//                text: this.toText
//            });
            
//            var singleLine = this.singleLine;
//            if(singleLine == 'auto'){
//                var el, w = this.ownerCt.getWidth() - this.ownerCt.getEl().getPadding('lr');
//                if(el = this.ownerCt.getEl().child('.x-panel-body')){
//                    w -= el.getPadding('lr');
//                }
//                if(el = this.ownerCt.getEl().child('.x-form-item-label')){
//                    w -= el.getWidth() - el.getPadding('lr');
//                }
//                singleLine = w <= this.singleLineMinWidth ? false : true;
//            }
//            
//            this.fieldCt = Ext.create('Ext.Container', {
//                autoEl: {id:this.id}, //make sure the container el has the field's id
//                cls: 'ext-dt-range',
//                renderTo: ct,
//                layout: 'table',
//                layoutConfig: {
//                    columns: singleLine ? 6 : 3
//                },
//                defaults: {
//                    hideParent: true
//                },
//                items:[
//                    this.startDate,
//                    this.startTime,
//                    this.toLabel,
//                    singleLine ? this.endTime : this.endDate,
//                    singleLine ? this.endDate : this.endTime,
//                    this.allDay
//                ]
//            });
//            
//            this.fieldCt.ownerCt = this;
//            this.el = this.fieldCt.getEl();
//            this.items = Ext.create('Ext.util.MixedCollection');
//            this.items.addAll([this.startDate, this.endDate, this.toLabel, this.startTime, this.endTime, this.allDay]);
//        }
//        
//        this.callParent(arguments);
//        
//        if(!singleLine){
//            this.el.child('tr').addCls('ext-dt-range-row1');
//        }
//    },

    // private
    onFieldChange: function(type, startend){
        this.checkDates(type, startend);
        this.fireEvent('change', this, this.getValue());
    },
        
    // private
    checkDates: function(type, startend){
        var me = this,
            startField = me.down('#' + me.id + '-start-' + type),
            endField = me.down('#' + me.id + '-end-' + type),
            startValue = me.getDT('start'),
            endValue = me.getDT('end');

        if(startValue > endValue){
            if(startend=='start'){
                endField.setValue(startValue);
            }else{
                startField.setValue(endValue);
                me.checkDates(type, 'start');
            }
        }
        if(type=='date'){
            me.checkDates('time', startend);
        }
    },
    
    /**
     * Returns an array containing the following values in order:<div class="mdetail-params"><ul>
     * <li><b><code>DateTime</code></b> : <div class="sub-desc">The start date/time</div></li>
     * <li><b><code>DateTime</code></b> : <div class="sub-desc">The end date/time</div></li>
     * <li><b><code>Boolean</code></b> : <div class="sub-desc">True if the dates are all-day, false 
     * if the time values should be used</div></li><ul></div>
     * @return {Array} The array of return values
     */
    getValue: function(){
        return [
            this.getDT('start'), 
            this.getDT('end'),
            this.allDay.getValue()
        ];
    },
    
    // private getValue helper
    getDT: function(startend){
        var time = this[startend+'Time'].getValue(),
            dt = this[startend+'Date'].getValue();
            
        if(Ext.isDate(dt)){
            dt = Ext.Date.format(dt, this[startend + 'Date'].format);
        }
        else{
            return null;
        };
        if(time && time != ''){
            time = Ext.Date.format(time, this[startend+'Time'].format);
            var val = Ext.Date.parseDate(dt + ' ' + time, this[startend+'Date'].format + ' ' + this[startend+'Time'].format);
            return val;
            //return Ext.Date.parseDate(dt+' '+time, this[startend+'Date'].format+' '+this[startend+'Time'].format);
        }
        return Ext.Date.parseDate(dt, this[startend+'Date'].format);
        
    },
    
    /**
     * Sets the values to use in the date range.
     * @param {Array/Date/Object} v The value(s) to set into the field. Valid types are as follows:<div class="mdetail-params"><ul>
     * <li><b><code>Array</code></b> : <div class="sub-desc">An array containing, in order, a start date, end date and all-day flag.
     * This array should exactly match the return type as specified by {@link #getValue}.</div></li>
     * <li><b><code>DateTime</code></b> : <div class="sub-desc">A single Date object, which will be used for both the start and
     * end dates in the range.  The all-day flag will be defaulted to false.</div></li>
     * <li><b><code>Object</code></b> : <div class="sub-desc">An object containing properties for StartDate, EndDate and IsAllDay
     * as defined in {@link Extensible.calendar.data.EventMappings}.</div></li><ul></div>
     */
    setValue: function(v){
        if(!v) {
            return;
        }
        if(Ext.isArray(v)){
            this.setDT(v[0], 'start');
            this.setDT(v[1], 'end');
            this.allDay.setValue(!!v[2]);
        }
        else if(Ext.isDate(v)){
            this.setDT(v, 'start');
            this.setDT(v, 'end');
            this.allDay.setValue(false);
        }
        else if(v[Extensible.calendar.data.EventMappings.StartDate.name]){ //object
            this.setDT(v[Extensible.calendar.data.EventMappings.StartDate.name], 'start');
            if(!this.setDT(v[Extensible.calendar.data.EventMappings.EndDate.name], 'end')){
                this.setDT(v[Extensible.calendar.data.EventMappings.StartDate.name], 'end');
            }
            this.allDay.setValue(!!v[Extensible.calendar.data.EventMappings.IsAllDay.name]);
        }
    },
    
    // private setValue helper
    setDT: function(dt, startend){
        if(dt && Ext.isDate(dt)){
            this[startend + 'Date'].setValue(dt);
            this[startend + 'Time'].setValue(Ext.Date.format(dt, this[startend + 'Time'].format));
            return true;
        }
    },
    
    // inherited docs
    isDirty: function(){
        var dirty = false;
        if(this.rendered && !this.disabled) {
            this.items.each(function(item){
                if (item.isDirty()) {
                    dirty = true;
                    return false;
                }
            });
        }
        return dirty;
    },
    
    // private
    onDisable : function(){
        this.delegateFn('disable');
    },
    
    // private
    onEnable : function(){
        this.delegateFn('enable');
    },
    
    // inherited docs
    reset : function(){
        this.delegateFn('reset');
    },
    
    // private
    delegateFn : function(fn){
        this.items.each(function(item){
            if (item[fn]) {
                item[fn]();
            }
        });
    },
    
    // private
    beforeDestroy: function(){
        Ext.destroy(this.fieldCt);
        this.callParent(arguments);
    },
    
    /**
     * @method getRawValue
     * @hide
     */
    getRawValue : Ext.emptyFn,
    /**
     * @method setRawValue
     * @hide
     */
    setRawValue : Ext.emptyFn
});