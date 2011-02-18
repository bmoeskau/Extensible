//TODO: remove this once we are synced to trunk again
Ext.override(Ext.XTemplate, {
    applySubTemplate : function(id, values, parent, xindex, xcount){
        var me = this,
            len,
            t = me.tpls[id],
            vs,
            buf = [];
        if ((t.test && !t.test.call(me, values, parent, xindex, xcount)) ||
            (t.exec && t.exec.call(me, values, parent, xindex, xcount))) {
            return '';
        }
        vs = t.target ? t.target.call(me, values, parent) : values;
        len = vs.length;
        parent = t.target ? values : parent;
        if(t.target && Ext.isArray(vs)){
            Ext.each(vs, function(v, i) {
                buf[buf.length] = t.compiled.call(me, v, parent, i+1, len);
            });
            return buf.join('');
        }
        return t.compiled.call(me, vs, parent, xindex, xcount);
    }
});


/* This fix is in Ext 3.2 */
Ext.override(Ext.form.DateField, {
	
	altFormats : "m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j",
	
    safeParse : function(value, format) {
        if (/[gGhH]/.test(format.replace(/(\\.)/g, ''))) {
            // if parse format contains hour information, no DST adjustment is necessary
            return Date.parseDate(value, format);
        } else {
            // set time to 12 noon, then clear the time
            var parsedDate = Date.parseDate(value + ' ' + this.initTime, format + ' ' + this.initTimeFormat);
            if (parsedDate) return parsedDate.clearTime();
        }
    }
});


/* This override applies to the current 3.3.x line to fix duplicate remote actions */
Ext.override(Ext.data.Store, {
    add : function(records) {
        var i, record, index;
        
        records = [].concat(records);
        if (records.length < 1) {
            return;
        }
        
        for (i = 0, len = records.length; i < len; i++) {
            record = records[i];
            
            record.join(this);
            
            //Extensible: Added the modified.indexOf check to avoid adding duplicate recs
            if ((record.dirty || record.phantom) && this.modified.indexOf(record) == -1) {
                this.modified.push(record);
            }
        }
        
        index = this.data.length;
        this.data.addAll(records);
        
        if (this.snapshot) {
            this.snapshot.addAll(records);
        }
        
        this.fireEvent('add', this, records, index);
    },
    
    insert : function(index, records) {
        var i, record;
        
        records = [].concat(records);
        for (i = 0, len = records.length; i < len; i++) {
            record = records[i];
            
            this.data.insert(index + i, record);
            record.join(this);
            
            //Extensible: Added the modified.indexOf check to avoid adding duplicate recs
            if ((record.dirty || record.phantom) && this.modified.indexOf(record) == -1) {
                this.modified.push(record);
            }
        }
        
        if (this.snapshot) {
            this.snapshot.addAll(records);
        }
        
        this.fireEvent('add', this, records, index);
    },
    
    // Interestingly, this method has no changes, but is included here because without it a very strange
    // race condition occurs. This method is used as a callback internally for the add event which
    // is fired from the add method (overridden above). As long as both methods are here everything is OK
    // but with createRecords removed and defaulted to the original class you end up with duplicate copies
    // of added records in the store's modified collection (since both methods add to it). Not sure exactly
    // how that happens, but including this fixes it.
    createRecords : function(store, records, index) {
        var modified = this.modified,
            length   = records.length,
            record, i;
        
        for (i = 0; i < length; i++) {
            record = records[i];
            
            if (record.phantom && record.isValid()) {
                record.markDirty();  // <-- Mark new records dirty (Ed: why?)
                
                //Extensible: Added the modified.indexOf check to avoid adding duplicate recs
                if (modified.indexOf(record) == -1) {
                    modified.push(record);
                }
            }
        }
        if (this.autoSave === true) {
            this.save();
        }
    }
});


// Have to add in full API support so that EventMemoryProxy can do its thing.
// Won't hurt normal read-only MemoryProxy read actions.
Ext.data.MemoryProxy = function(data){
    var api = {};
    api[Ext.data.Api.actions.read] = true;
    api[Ext.data.Api.actions.create] = true;
    api[Ext.data.Api.actions.update] = true;
    api[Ext.data.Api.actions.destroy] = true;
    Ext.data.MemoryProxy.superclass.constructor.call(this, {
        api: api
    });
    this.data = data;
};

Ext.extend(Ext.data.MemoryProxy, Ext.data.DataProxy, {
    doRequest : function(action, rs, params, reader, callback, scope, arg) {
        if(action === Ext.data.Api.actions.read){
            params = params || {};
            var result;
            try {
                result = reader.readRecords(this.data);
            }catch(e){
                // @deprecated loadexception
                this.fireEvent("loadexception", this, null, arg, e);
                this.fireEvent('exception', this, 'response', action, arg, null, e);
                callback.call(scope, null, arg, false);
                return;
            }
            callback.call(scope, result, arg, true);
        }
    }
});
