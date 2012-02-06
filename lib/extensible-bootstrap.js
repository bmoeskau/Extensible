/**
 * @class Extensible
 * Extensible core utilities and functions.
 * @singleton
 */
Ext.define('Extensible', {
    
    singleton: true,
    
    /**
     * The version of the Extensible framework
     * @type String
     */
    version : '1.5.1',
    /**
     * The version of the framework, broken out into its numeric parts. This returns an
     * object that contains the following integer properties: major, minor and patch.
     * @type Object
     */
    versionDetails : {
        major: 1,
        minor: 5,
        patch: 1
    },
    /**
     * The minimum version of Ext required to work with this version of Extensible, currently
     * 4.0.1. Note that the 4.0.0 Ext JS release is not compatible.
     * @type String
     */
    extVersion : '4.0.1',
    
    // private
    hasBorderRadius : Ext.supports.CSS3BorderRadius,
    
    // private
    log : function(s){
        //console.log(s);
    },
    
    // private
    getScrollWidth: function() {
        return Ext.getScrollbarSize ? Ext.getScrollbarSize().width : Ext.getScrollBarWidth();
    },
    
    // private
    constructor: function() {
        Ext.onReady(function() {
            if (Extensible.getScrollWidth() < 3) {
                // OSX Lion introduced dynamic scrollbars that do not take up space in the
                // body. Since certain aspects of the layout are calculated and rely on
                // scrollbar width, we add this class if needed so that we can apply
                // static style rules rather than recalculate sizes on each resize.
                // We check for less than 3 because the Ext scrollbar measurement gets
                // slightly padded (not sure the reason), so it's never returned as 0. 
                Ext.getBody().addCls('x-no-scrollbar');
            }
            if (Ext.isWindows) {
                Ext.getBody().addCls('x-win');
            }
        });
    },

   /**
    * @class Extensible.Date
    * @extends Object
    * Contains utility date functions used by the calendar components.
    * @singleton
    */
    Date : {
        /**
         * Determines whether times used throughout all Extensible components should be displayed as
         * 12 hour times with am/pm (default) or 24 hour / military format. Note that some locale files
         * may override this value by default.
         * @type Boolean
         * @property use24HourTime
         */
        use24HourTime : false,
        
        /**
         * Returns the time duration between two dates in the specified units. For finding the number of
         * calendar days (ignoring time) between two dates use {@link Ext.ensible.Date.diffDays diffDays} instead.
         * @param {Date} start The start date
         * @param {Date} end The end date
         * @param {String} unit (optional) The time unit to return. Valid values are 'ms' (milliseconds,
         * the default), 's' (seconds), 'm' (minutes) or 'h' (hours).
         * @return {Number} The time difference between the dates in the units specified by the unit param
         */
        diff : function(start, end, unit){
            var denom = 1,
                diff = end.getTime() - start.getTime();
            
            if(unit == 's'){ 
                denom = 1000;
            }
            else if(unit == 'm'){
                denom = 1000*60;
            }
            else if(unit == 'h'){
                denom = 1000*60*60;
            }
            return Math.round(diff/denom);
        },
        
        /**
         * Calculates the number of calendar days between two dates, ignoring time values. 
         * A time span that starts at 11pm (23:00) on Monday and ends at 1am (01:00) on Wednesday is 
         * only 26 total hours, but it spans 3 calendar days, so this function would return 3. For the
         * exact time difference, use {@link Ext.ensible.Date.diff diff} instead.
         * @param {Date} start The start date
         * @param {Date} end The end date
         * @return {Number} The number of calendar days difference between the dates
         */
        diffDays : function(start, end){
            var day = 1000*60*60*24,
                clear = Ext.Date.clearTime,
                diff = clear(end, true).getTime() - clear(start, true).getTime();
            
            return Math.ceil(diff/day);
        },
        
        /**
         * Copies the time value from one date object into another without altering the target's 
         * date value. This function returns a new Date instance without modifying either original value.
         * @param {Date} fromDt The original date from which to copy the time
         * @param {Date} toDt The target date to copy the time to
         * @return {Date} The new date/time value
         */
        copyTime : function(fromDt, toDt){
            var dt = Ext.Date.clone(toDt);
            dt.setHours(
                fromDt.getHours(),
                fromDt.getMinutes(),
                fromDt.getSeconds(),
                fromDt.getMilliseconds());
            
            return dt;
        },
        
        /**
         * Compares two dates and returns a value indicating how they relate to each other.
         * @param {Date} dt1 The first date
         * @param {Date} dt2 The second date
         * @param {Boolean} precise (optional) If true, the milliseconds component is included in the comparison,
         * else it is ignored (the default).
         * @return {Number} The number of milliseconds difference between the two dates. If the dates are equal
         * this will be 0.  If the first date is earlier the return value will be positive, and if the second date
         * is earlier the value will be negative.
         */
        compare : function(dt1, dt2, precise){
            var d1 = dt1, d2 = dt2;
            if(precise !== true){
                d1 = Ext.Date.clone(dt1);
                d1.setMilliseconds(0);
                d2 = Ext.Date.clone(dt2);
                d2.setMilliseconds(0);
            }
            return d2.getTime() - d1.getTime();
        },

        // private helper fn
        maxOrMin : function(max){
            var dt = (max ? 0 : Number.MAX_VALUE), i = 0, args = arguments[1], ln = args.length;
            for(; i < ln; i++){
                dt = Math[max ? 'max' : 'min'](dt, args[i].getTime());
            }
            return new Date(dt);
        },
        
        /**
         * Returns the maximum date value passed into the function. Any number of date 
         * objects can be passed as separate params.
         * @param {Date} dt1 The first date
         * @param {Date} dt2 The second date
         * @param {Date} dtN (optional) The Nth date, etc.
         * @return {Date} A new date instance with the latest date value that was passed to the function
         */
		max : function(){
            return this.maxOrMin.apply(this, [true, arguments]);
        },
        
        /**
         * Returns the minimum date value passed into the function. Any number of date 
         * objects can be passed as separate params.
         * @param {Date} dt1 The first date
         * @param {Date} dt2 The second date
         * @param {Date} dtN (optional) The Nth date, etc.
         * @return {Date} A new date instance with the earliest date value that was passed to the function
         */
		min : function(){
            return this.maxOrMin.apply(this, [false, arguments]);
        },
        
        isInRange : function(dt, rangeStart, rangeEnd) {
            return  (dt >= rangeStart && dt <= rangeEnd);
        },
        
        /**
         * Returns true if two date ranges overlap (either one starts or ends within the other, or one completely
         * overlaps the start and end of the other), else false if they do not.
         * @param {Date} start1 The start date of range 1
         * @param {Date} end1   The end date of range 1
         * @param {Date} start2 The start date of range 2
         * @param {Date} end2   The end date of range 2
         * @return {Booelan} True if the ranges overlap, else false
         */
        rangesOverlap : function(start1, end1, start2, end2){
            var startsInRange = (start1 >= start2 && start1 <= end2),
                endsInRange = (end1 >= start2 && end1 <= end2),
                spansRange = (start1 <= start2 && end1 >= end2);
            
            return (startsInRange || endsInRange || spansRange);
        },
        
        /**
         * Returns true if the specified date is a Saturday or Sunday, else false.
         * @param {Date} dt The date to test
         * @return {Boolean} True if the date is a weekend day, else false 
         */
        isWeekend : function(dt){
            return dt.getDay() % 6 === 0;
        },
        
        /**
         * Returns true if the specified date falls on a Monday through Friday, else false.
         * @param {Date} dt The date to test
         * @return {Boolean} True if the date is a week day, else false 
         */
        isWeekday : function(dt){
            return dt.getDay() % 6 !== 0;
        },
        
        /**
         * Returns true if the specified date's time component equals 00:00, ignoring
         * seconds and milliseconds.
         * @param {Object} dt The date to test
         * @return {Boolean} True if the time is midnight, else false
         */
        isMidnight : function(dt) {
            return dt.getHours() === 0 && dt.getMinutes() === 0;
        },
        
        /**
         * Returns true if the specified date is the current browser-local date, else false.
         * @param {Object} dt The date to test
         * @return {Boolean} True if the date is today, else false
         */
        isToday : function(dt) {
            return this.diffDays(dt, this.today()) === 0;
        },
        
        /**
         * Convenience method to get the current browser-local date with no time value.
         * @return {Date} The current date, with time 00:00
         */
        today : function() {
            return Ext.Date.clearTime(new Date());
        },
        
        /**
         * Add time to the specified date and returns a new Date instance as the result (does not
         * alter the original date object). Time can be specified in any combination of milliseconds
         * to years, and the function automatically takes leap years and daylight savings into account.
         * Some syntax examples:<code><pre>
var now = new Date();

// Add 24 hours to the current date/time:
var tomorrow = Extensible.Date.add(now, { days: 1 });

// More complex, returning a date only with no time value:
var futureDate = Extensible.Date.add(now, {
    weeks: 1,
    days: 5,
    minutes: 30,
    clearTime: true
});
</pre></code>
         * @param {Date} dt The starting date to which to add time
         * @param {Object} o A config object that can contain one or more of the following
         * properties, each with an integer value: <ul>
         * <li>millis</li>
         * <li>seconds</li>
         * <li>minutes</li>
         * <li>hours</li>
         * <li>days</li>
         * <li>weeks</li>
         * <li>months</li>
         * <li>years</li></ul>
         * You can also optionally include the property "clearTime: true" which will perform all of the
         * date addition first, then clear the time value of the final date before returning it.
         * @return {Date} A new date instance containing the resulting date/time value
         */
        add : function(dt, o) {
            if (!o) {
                return dt;
            }
            var ExtDate = Ext.Date,
                dateAdd = ExtDate.add,
                newDt = ExtDate.clone(dt);
            
            if (o.years) {
                newDt = dateAdd(newDt, ExtDate.YEAR, o.years);
            }
            if (o.months) {
                newDt = dateAdd(newDt, ExtDate.MONTH, o.months);
            }
            if (o.weeks) {
                o.days = (o.days || 0) + (o.weeks * 7);
            }
            if (o.days) {
                newDt = dateAdd(newDt, ExtDate.DAY, o.days);
            }
            if (o.hours) {
                newDt = dateAdd(newDt, ExtDate.HOUR, o.hours);
            }
            if (o.minutes) {
                newDt = dateAdd(newDt, ExtDate.MINUTE, o.minutes);
            }
            if (o.seconds) {
                newDt = dateAdd(newDt, ExtDate.SECOND, o.seconds);
            }
            if (o.millis) {
                newDt = dateAdd(newDt, ExtDate.MILLI, o.millis);
            }
             
            return o.clearTime ? ExtDate.clearTime(newDt) : newDt;
        }
    }
});


/* =========================================================
 * @private
 * Ext overrides required by Extensible components
 * =========================================================
 */
Ext.require([
    'Ext.picker.Color',
    'Ext.form.Basic',
    'Ext.data.MemoryProxy'
]);

Extensible.applyOverrides = function() {

    Ext.DomHelper = Ext.core.DomHelper;
    
    var extVersion = Ext.getVersion();
    
    // This was fixed in Ext 4.0.5:
    if (Ext.layout.container.AbstractCard) {
        Ext.layout.container.AbstractCard.override({
            renderChildren: function () {
                // added check to honor deferredRender when rendering children
                if (!this.deferredRender) {
                    this.getActiveItem();
                    this.callParent();
                }
            }
        });
    }
    
    // This was fixed in Ext 4.0.4?
    Ext.Component.override({
        getId: function() {
            var me = this,
                xtype;
            
            if (!me.id) {
                xtype = me.getXType();
                xtype = xtype ? xtype.replace(/[\.,\s]/g, '-') : 'ext-comp';
                me.id = xtype + '-' + me.getAutoId();
            }
            return me.id;
        }
    });
    
    if (Ext.picker && Ext.picker.Color) {
        Ext.picker.Color.override({
            constructor: function() {
                // use an existing renderTpl if specified
                this.renderTpl = this.renderTpl || Ext.create('Ext.XTemplate', '<tpl for="colors"><a href="#" ' +
                    'class="color-{.}" hidefocus="on"><em><span style="background:#{.}" ' +
                    'unselectable="on">&#160;</span></em></a></tpl>');
    
                this.callParent(arguments);
            }
        });
    }
    
    if (extVersion.isLessThan('4.1')) {
        if (Ext.data && Ext.data.reader && Ext.data.reader.Reader) {
            Ext.data.reader.Reader.override({
                extractData : function(root) {
                    var me = this,
                        values  = [],
                        records = [],
                        Model   = me.model,
                        i       = 0,
                        length  = root.length,
                        idProp  = me.getIdProperty(),
                        node, id, record;
                        
                    if (!root.length && Ext.isObject(root)) {
                        root = [root];
                        length = 1;
                    }
            
                    for (; i < length; i++) {
                        node   = root[i];
                        values = me.extractValues(node);
                        
                        // Assuming that the idProperty is intended to use the id mapping, if
                        // available, getId() should read from the mapped values not the raw values.
                        // Using the non-mapped id causes updates later to silently fail since
                        // the updated data is replaced by id.
                        //id = me.getId(node);
                        id = me.getId(values);
                        
                        record = new Model(values, id, node);
                        records.push(record);
                            
                        if (me.implicitIncludes) {
                            me.readAssociated(record, node);
                        }
                    }
            
                    return records;
                }
            });
        }
    }
    
    if (Ext.form && Ext.form.Basic) {
        Ext.form.Basic.override({
            reset: function() {
                var me = this;
                // This causes field events to be ignored. This is a problem for the
                // DateTimeField since it relies on handling the all-day checkbox state
                // changes to refresh its layout. In general, this batching is really not
                // needed -- it was an artifact of pre-4.0 performance issues and can be removed.
                //me.batchLayouts(function() {
                    me.getFields().each(function(f) {
                        f.reset();
                    });
                //});
                return me;
            }
        });
    }

    // Currently MemoryProxy really only functions for read-only data. Since we want
    // to simulate CRUD transactions we have to at the very least allow them to be
    // marked as completed and successful, otherwise they will never filter back to the
    // UI components correctly.
    if (Ext.data && Ext.data.MemoryProxy) {
        Ext.data.MemoryProxy.override({
            updateOperation: function(operation, callback, scope) {
                Ext.each(operation.records, function(rec) {
                    rec.commit();
                });
                operation.setCompleted();
                operation.setSuccessful();
                Ext.callback(callback, scope || this, [operation]);
            },
            create: function() {
                this.updateOperation.apply(this, arguments);
            },
            update: function() {
                this.updateOperation.apply(this, arguments);
            },
            destroy: function() {
                this.updateOperation.apply(this, arguments);
            }
        });
    }
};

Ext.onReady(Extensible.applyOverrides);