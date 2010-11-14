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
