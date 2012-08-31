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
    version: '1.6.0-b1',
    /**
     * The version of the framework, broken out into its numeric parts. This returns an
     * object that contains the following integer properties: major, minor and patch.
     * @type Object
     */
    versionDetails: {
        major: 1,
        minor: 6,
        patch: 0
    },
    /**
     * The minimum version of Ext required to work with this version of Extensible, currently
     * 4.0.1. Note that the 4.0.0 Ext JS release is not compatible.
     * @type String
     */
    extVersion: '4.0.1',
    
    // private
    hasBorderRadius: Ext.supports.CSS3BorderRadius,
    
    // private
    log: function(s){
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
            
            var extVer = Ext.getVersion();
            if (extVer.isLessThan('4.1')) {
                // Unfortunately some styling changed in 4.1 that requires version-specific
                // CSS differences to handle properly across versions. Ugh.
                Ext.getBody().addCls('x-4-0');
            }
        });
    },

   /**
    * @class Extensible.Date
    * @extends Object
    * Contains utility date functions used by the calendar components.
    * @singleton
    */
    Date: {
        /**
         * Determines whether times used throughout all Extensible components should be displayed as
         * 12 hour times with am/pm (default) or 24 hour / military format. Note that some locale files
         * may override this value by default.
         * @type Boolean
         * @property use24HourTime
         */
        use24HourTime: false,
        
        /**
         * Returns the time duration between two dates in the specified units. For finding the number of
         * calendar days (ignoring time) between two dates use {@link Ext.ensible.Date.diffDays diffDays} instead.
         * @param {Date} start The start date
         * @param {Date} end The end date
         * @param {String} unit (optional) The time unit to return. Valid values are 'millis' (the default),
         * 'seconds', 'minutes' or 'hours'.
         * @return {Number} The time difference between the dates in the units specified by the unit param
         */
        diff: function(start, end, unit) {
            var denom = 1,
                diff = end.getTime() - start.getTime();
            
            if (unit === 's' || unit === 'seconds') {
                denom = 1000;
            }
            else if (unit === 'm' || unit === 'minutes') {
                denom = 1000*60;
            }
            else if (unit === 'h' || unit === 'hours') {
                denom = 1000*60*60;
            }
            return Math.round(diff / denom);
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
        diffDays: function(start, end) {
            var day = 1000*60*60*24,
                clear = Ext.Date.clearTime,
                diff;
            
            // if (Extensible.Date.isMidnight(end)) {
                // end = Extensible.Date.add(end, {'seconds': -1});
            // }
            diff = clear(end, true).getTime() - clear(start, true).getTime();
            
            return Math.ceil(diff / day);
        },
        
        /**
         * Copies the time value from one date object into another without altering the target's
         * date value. This function returns a new Date instance without modifying either original value.
         * @param {Date} fromDt The original date from which to copy the time
         * @param {Date} toDt The target date to copy the time to
         * @return {Date} The new date/time value
         */
        copyTime: function(fromDt, toDt) {
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
        compare: function(dt1, dt2, precise) {
            var d1 = dt1, d2 = dt2;
            
            if (precise !== true) {
                d1 = Ext.Date.clone(dt1);
                d1.setMilliseconds(0);
                d2 = Ext.Date.clone(dt2);
                d2.setMilliseconds(0);
            }
            return d2.getTime() - d1.getTime();
        },

        // private helper fn
        maxOrMin: function(max) {
            var dt = max ? 0: Number.MAX_VALUE,
                i = 0,
                args = arguments[1],
                ln = args.length;
            
            for (; i < ln; i++) {
                dt = Math[max ? 'max': 'min'](dt, args[i].getTime());
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
		max: function() {
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
		min: function() {
            return this.maxOrMin.apply(this, [false, arguments]);
        },
        
        isInRange: function(dt, rangeStart, rangeEnd) {
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
        rangesOverlap: function(start1, end1, start2, end2) {
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
        isWeekend: function(dt) {
            return dt.getDay() % 6 === 0;
        },
        
        /**
         * Returns true if the specified date falls on a Monday through Friday, else false.
         * @param {Date} dt The date to test
         * @return {Boolean} True if the date is a week day, else false
         */
        isWeekday: function(dt) {
            return dt.getDay() % 6 !== 0;
        },
        
        /**
         * Returns true if the specified date's time component equals 00:00, ignoring
         * seconds and milliseconds.
         * @param {Object} dt The date to test
         * @return {Boolean} True if the time is midnight, else false
         */
        isMidnight: function(dt) {
            return dt.getHours() === 0 && dt.getMinutes() === 0;
        },
        
        /**
         * Returns true if the specified date is the current browser-local date, else false.
         * @param {Object} dt The date to test
         * @return {Boolean} True if the date is today, else false
         */
        isToday: function(dt) {
            return this.diffDays(dt, this.today()) === 0;
        },
        
        /**
         * Convenience method to get the current browser-local date with no time value.
         * @return {Date} The current date, with time 00:00
         */
        today: function() {
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
        add: function(dt, o) {
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
             
            return o.clearTime ? ExtDate.clearTime(newDt): newDt;
        },
        
        clearTime: function(dt, clone) {
            return Ext.Date.clearTime(dt, clone);
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
    'Ext.data.proxy.Memory'
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
                xtype = xtype ? xtype.replace(/[\.,\s]/g, '-'): 'ext-comp';
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
                extractData: function(root) {
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
    if (Ext.data && Ext.data.proxy && Ext.data.proxy.Memory) {
        Ext.data.proxy.Memory.override({
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
    
    // In Ext 4.0.x, CheckboxGroup's resetOriginalValue uses a defer hack that was removed
    // in 4.1. Unfortunately that defer hack causes a runtime error in certain situations
    // and is not really needed, so we'll replace any 4.0.x version with the new fixed version.
    if (extVersion.isLessThan('4.1') && Ext.form && Ext.form.CheckboxGroup) {
        Ext.form.CheckboxGroup.override({
            resetOriginalValue: function(){
                var me = this;
                
                me.eachBox(function(box){
                    box.resetOriginalValue();
                });
                me.originalValue = me.getValue();
                me.checkDirty();
            }
        });
    }
    
    // Prior to 4.1.2 there was a serious bug in JsonReader that threw a runtime error in the case
    // of nested field mappings (e.g. mapping: 'some.nested.property') when some levels in the mapping
    // could potentially be null. This was fixed in 4.1.2.
    if (extVersion.isLessThan('4.1.2') && Ext.data && Ext.data.reader && Ext.data.reader.Json) {
        Ext.data.reader.Json.override({
            createFieldAccessExpression: (function() {
                var re = /[\[\.]/;
                
                return function(field, fieldVarName, dataName) {
                    var me     = this,
                        hasMap = (field.mapping !== null),
                        map    = hasMap ? field.mapping : field.name,
                        result,
                        operatorIndex;
                    
                    if (typeof map === 'function') {
                        result = fieldVarName + '.mapping(' + dataName + ', this)';
                    } else if (this.useSimpleAccessors === true || ((operatorIndex = String(map).search(re)) < 0)) {
                        if (!hasMap || isNaN(map)) {
                            // If we don't provide a mapping, we may have a field name that is numeric
                            map = '"' + map + '"';
                        }
                        result = dataName + "[" + map + "]";
                    } else if (operatorIndex === 0) {
                        // If it matched at index 0 then it must be bracket syntax (e.g. ["foo"]). In this case simply
                        // join the two, e.g. 'field["foo"]':
                        result = dataName + map;
                    } else {
                        // If it matched at index > 0 it must be either dot syntax (e.g. field.foo) or a values array
                        // item (e.g. values[0]). For the latter, we can simply concatenate the values reference to
                        // the source directly like 'field.values[0]'. For dot notation we have to support arbitrary
                        // levels (field.foo.bar), any of which could be null or undefined, so we have to create the
                        // returned value such that the references will be assigned defensively in the calling code.
                        // The output should look like 'field.foo && field.foo.bar' in that case.
                        var parts = map.split('.'),
                            len = parts.length,
                            i = 1,
                            tempResult = dataName + '.' + parts[0],
                            buffer = [tempResult]; // for 'field.values[0]' this will be the returned result
                        
                        for (; i < len; i++) {
                            tempResult += '.' + parts[i];
                            buffer.push(tempResult);
                        }
                        result = buffer.join(' && ');
                    }
                    return result;
                };
            }())
        });
    }
    
    // Added support for writeRecordId in 4.1.2, and also fixed a bug where the non-mapped record id
    // was always included in the output in addition to the mapped id when a mapping was used.
    if (extVersion.isLessThan('4.1.2') && Ext.data && Ext.data.writer && Ext.data.writer.Writer) {
        Ext.data.writer.Writer.override({
            writeRecordId: true,
            getRecordData: function(record, operation) {
                var isPhantom = record.phantom === true,
                    writeAll = this.writeAllFields || isPhantom,
                    fields = record.fields,
                    fieldItems = fields.items,
                    data = {},
                    clientIdProperty = record.clientIdProperty,
                    changes,
                    field,
                    key,
                    value,
                    mappedIdProperty,
                    f, fLen;
        
                if (writeAll) {
                    fLen = fieldItems.length;
        
                    for (f = 0; f < fLen; f++) {
                        field = fieldItems[f];
                        if (field.persist) {
                            this.writeValue(data, field, record);
                        }
                    }
                } else {
                    // Only write the changes
                    changes = record.getChanges();
                    for (key in changes) {
                        if (changes.hasOwnProperty(key)) {
                            field = fields.get(key);
                            if (field.persist) {
                                this.writeValue(data, field, record);
                            }
                        }
                    }
                }
                if (isPhantom) {
                    if (clientIdProperty && operation && operation.records.length > 1) {
                        // include clientId for phantom records, if multiple records are being written to the server in one operation.
                        // The server can then return the clientId with each record so the operation can match the server records with the client records
                        data[clientIdProperty] = record.internalId;
                    }
                } else if (this.writeRecordId) {
                    // Make sure that if a mapping is in place the mapped id name is used instead of the default field name. 
                    mappedIdProperty = fields.get(record.idProperty)[this.nameProperty] || record.idProperty;
                    data[mappedIdProperty] = record.getId();
                }
        
                return data;
            }
        });
    }
    
    // Added support for expandData in 4.1.2
    if (extVersion.isLessThan('4.1.2') && Ext.data && Ext.data.writer && Ext.data.writer.Json) {
        Ext.data.writer.Json.override({
            expandData: false,
            getExpandedData: function(data) {
                var dataLength = data.length,
                    i = 0,
                    item,
                    prop,
                    nameParts,
                    j,
                    tempObj,
                    
                    toObject = function(name, value) {
                        var o = {};
                        o[name] = value;
                        return o;
                    };
                
                for (; i < dataLength; i++) {
                    item = data[i];
                    
                    for (prop in item) {
                        if (item.hasOwnProperty(prop)) {
                            // e.g. my.nested.property: 'foo'
                            nameParts = prop.split('.');
                            j = nameParts.length - 1;
                            
                            if (j > 0) {
                                // Initially this will be the value 'foo'.
                                // Equivalent to rec['my.nested.property']
                                tempObj = item[prop];
                                
                                for (; j > 0; j--) {
                                    // Starting with the value above, we loop inside out, assigning the
                                    // current object as the value for the parent name. Work all
                                    // the way up until only the root name is left to assign.
                                    tempObj = toObject(nameParts[j], tempObj);
                                }
                                
                                // At this point we'll have all child properties rolled up into a single
                                // object like `{ nested: { property: 'foo' }}`. Now add the root name
                                // (e.g. 'my') to the record data if needed (do not overwrite existing):
                                item[nameParts[0]] = item[nameParts[0]] || {};
                                // Since there could be duplicate names at any level of the nesting be sure
                                // to merge rather than assign when setting the object as the value:
                                Ext.Object.merge(item[nameParts[0]], tempObj);
                                // Finally delete the original mapped property from the record
                                delete item[prop];
                            }
                        }
                    }
                }
                return data;
            },
            writeRecords: function(request, data) {
                var root = this.root;
                
                if (this.expandData) {
                    data = this.getExpandedData(data);
                }
                
                if (this.allowSingle && data.length === 1) {
                    // convert to single object format
                    data = data[0];
                }
                
                if (this.encode) {
                    if (root) {
                        // sending as a param, need to encode
                        request.params[root] = Ext.encode(data);
                    } else {
                        //<debug>
                        Ext.Error.raise('Must specify a root when using encode');
                        //</debug>
                    }
                } else {
                    // send as jsonData
                    request.jsonData = request.jsonData || {};
                    if (root) {
                        request.jsonData[root] = data;
                    } else {
                        request.jsonData = data;
                    }
                }
                return request;
            }
        });
    }
};

Ext.onReady(Extensible.applyOverrides);