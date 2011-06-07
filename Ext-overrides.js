
Ext.DomHelper = Ext.core.DomHelper;

Ext.picker.Color.override({
    constructor: function() {
        // use an existing renderTpl if specified
        this.renderTpl = this.renderTpl || Ext.create('Ext.XTemplate', '<tpl for="colors"><a href="#" class="color-{.}" hidefocus="on"><em><span style="background:#{.}" unselectable="on">&#160;</span></em></a></tpl>');
        this.callParent(arguments);
    }
});

//TODO: remove this once we are synced to trunk again
//Ext.override(Ext.XTemplate, {
//    applySubTemplate : function(id, values, parent, xindex, xcount){
//        var me = this,
//            len,
//            t = me.tpls[id],
//            vs,
//            buf = [];
//        if ((t.test && !t.test.call(me, values, parent, xindex, xcount)) ||
//            (t.exec && t.exec.call(me, values, parent, xindex, xcount))) {
//            return '';
//        }
//        vs = t.target ? t.target.call(me, values, parent) : values;
//        len = vs.length;
//        parent = t.target ? values : parent;
//        if(t.target && Ext.isArray(vs)){
//            Ext.each(vs, function(v, i) {
//                buf[buf.length] = t.compiled.call(me, v, parent, i+1, len);
//            });
//            return buf.join('');
//        }
//        return t.compiled.call(me, vs, parent, xindex, xcount);
//    }
//});


/* This fix is in Ext 3.2 */
//Ext.override(Ext.form.DateField, {
//	
//	altFormats : "m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j",
//	
//    safeParse : function(value, format) {
//        if (/[gGhH]/.test(format.replace(/(\\.)/g, ''))) {
//            // if parse format contains hour information, no DST adjustment is necessary
//            return Date.parseDate(value, format);
//        } else {
//            // set time to 12 noon, then clear the time
//            var parsedDate = Date.parseDate(value + ' ' + this.initTime, format + ' ' + this.initTimeFormat);
//            if (parsedDate) return parsedDate.clearTime();
//        }
//    }
//});


/* This override applies to the current 3.3.x line to fix duplicate remote actions */
//Ext.override(Ext.data.Store, {
//    add : function(records) {
//        var i, record, index;
//        
//        records = [].concat(records);
//        if (records.length < 1) {
//            return;
//        }
//        
//        for (i = 0, len = records.length; i < len; i++) {
//            record = records[i];
//            
//            record.join(this);
//            
//            //Extensible: Added the modified.indexOf check to avoid adding duplicate recs
//            if ((record.dirty || record.phantom) && this.modified.indexOf(record) == -1) {
//                this.modified.push(record);
//            }
//        }
//        
//        index = this.data.length;
//        this.data.addAll(records);
//        
//        if (this.snapshot) {
//            this.snapshot.addAll(records);
//        }
//        
//        this.fireEvent('add', this, records, index);
//    },
//    
//    insert : function(index, records) {
//        var i, record;
//        
//        records = [].concat(records);
//        for (i = 0, len = records.length; i < len; i++) {
//            record = records[i];
//            
//            this.data.insert(index + i, record);
//            record.join(this);
//            
//            //Extensible: Added the modified.indexOf check to avoid adding duplicate recs
//            if ((record.dirty || record.phantom) && this.modified.indexOf(record) == -1) {
//                this.modified.push(record);
//            }
//        }
//        
//        if (this.snapshot) {
//            this.snapshot.addAll(records);
//        }
//        
//        this.fireEvent('add', this, records, index);
//    },
//    
//    // Interestingly, this method has no changes, but is included here because without it a very strange
//    // race condition occurs. This method is used as a callback internally for the add event which
//    // is fired from the add method (overridden above). As long as both methods are here everything is OK
//    // but with createRecords removed and defaulted to the original class you end up with duplicate copies
//    // of added records in the store's modified collection (since both methods add to it). Not sure exactly
//    // how that happens, but including this fixes it.
//    createRecords : function(store, records, index) {
//        var modified = this.modified,
//            length   = records.length,
//            record, i;
//        
//        for (i = 0; i < length; i++) {
//            record = records[i];
//            
//            if (record.phantom && record.isValid()) {
//                record.markDirty();  // <-- Mark new records dirty (Ed: why?)
//                
//                //Extensible: Added the modified.indexOf check to avoid adding duplicate recs
//                if (modified.indexOf(record) == -1) {
//                    modified.push(record);
//                }
//            }
//        }
//        if (this.autoSave === true) {
//            this.save();
//        }
//    }
//});


// Have to add in full API support so that EventMemoryProxy can do its thing.
// Won't hurt normal read-only MemoryProxy read actions.
//Ext.data.MemoryProxy = function(data){
//    var api = {};
//    api[Ext.data.Api.actions.read] = true;
//    api[Ext.data.Api.actions.create] = true;
//    api[Ext.data.Api.actions.update] = true;
//    api[Ext.data.Api.actions.destroy] = true;
//    Ext.data.MemoryProxy.superclass.constructor.call(this, {
//        api: api
//    });
//    this.data = data;
//};
//Ext.extend(Ext.data.MemoryProxy, Ext.data.DataProxy, {
//    doRequest : function(action, rs, params, reader, callback, scope, arg) {
//        if(action === Ext.data.Api.actions.read){
//            params = params || {};
//            var result;
//            try {
//                result = reader.readRecords(this.data);
//            }catch(e){
//                // @deprecated loadexception
//                this.fireEvent("loadexception", this, null, arg, e);
//                this.fireEvent('exception', this, 'response', action, arg, null, e);
//                callback.call(scope, null, arg, false);
//                return;
//            }
//        }
//        callback.call(scope, result, arg, true);
//    }
//});
Ext.data.MemoryProxy.override({
    updateOperation: function(operation, callback, scope) {
        operation.setCompleted();
        operation.setSuccessful();
        Ext.callback(callback, scope || me, [operation]);
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

// This heinous override is required to fix IE9's removal of createContextualFragment.
// Unfortunately since DomHelper is a singleton there's not much of a way around it.
//Ext.apply(Ext.DomHelper,
//function(){
//    var tempTableEl = null,
//        emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,
//        tableRe = /^table|tbody|tr|td$/i,
//        confRe = /tag|children|cn|html$/i,
//        tableElRe = /td|tr|tbody/i,
//        cssRe = /([a-z0-9-]+)\s*:\s*([^;\s]+(?:\s*[^;\s]+)*);?/gi,
//        endRe = /end/i,
//        pub,
//        // kill repeat to save bytes
//        afterbegin = 'afterbegin',
//        afterend = 'afterend',
//        beforebegin = 'beforebegin',
//        beforeend = 'beforeend',
//        ts = '<table>',
//        te = '</table>',
//        tbs = ts+'<tbody>',
//        tbe = '</tbody>'+te,
//        trs = tbs + '<tr>',
//        tre = '</tr>'+tbe;
//
//    // private
//    function doInsert(el, o, returnElement, pos, sibling, append){
//        var newNode = pub.insertHtml(pos, Ext.getDom(el), createHtml(o));
//        return returnElement ? Ext.get(newNode, true) : newNode;
//    }
//
//    // build as innerHTML where available
//    function createHtml(o){
//        var b = '',
//            attr,
//            val,
//            key,
//            cn;
//
//        if(typeof o == "string"){
//            b = o;
//        } else if (Ext.isArray(o)) {
//            for (var i=0; i < o.length; i++) {
//                if(o[i]) {
//                    b += createHtml(o[i]);
//                }
//            };
//        } else {
//            b += '<' + (o.tag = o.tag || 'div');
//            for (attr in o) {
//                val = o[attr];
//                if(!confRe.test(attr)){
//                    if (typeof val == "object") {
//                        b += ' ' + attr + '="';
//                        for (key in val) {
//                            b += key + ':' + val[key] + ';';
//                        };
//                        b += '"';
//                    }else{
//                        b += ' ' + ({cls : 'class', htmlFor : 'for'}[attr] || attr) + '="' + val + '"';
//                    }
//                }
//            };
//            // Now either just close the tag or try to add children and close the tag.
//            if (emptyTags.test(o.tag)) {
//                b += '/>';
//            } else {
//                b += '>';
//                if ((cn = o.children || o.cn)) {
//                    b += createHtml(cn);
//                } else if(o.html){
//                    b += o.html;
//                }
//                b += '</' + o.tag + '>';
//            }
//        }
//        return b;
//    }
//
//    function ieTable(depth, s, h, e){
//        tempTableEl.innerHTML = [s, h, e].join('');
//        var i = -1,
//            el = tempTableEl,
//            ns;
//        while(++i < depth){
//            el = el.firstChild;
//        }
////      If the result is multiple siblings, then encapsulate them into one fragment.
//        if(ns = el.nextSibling){
//            var df = document.createDocumentFragment();
//            while(el){
//                ns = el.nextSibling;
//                df.appendChild(el);
//                el = ns;
//            }
//            el = df;
//        }
//        return el;
//    }
//
//    /**
//     * @ignore
//     * Nasty code for IE's broken table implementation
//     */
//    function insertIntoTable(tag, where, el, html) {
//        var node,
//            before;
//
//        tempTableEl = tempTableEl || document.createElement('div');
//
//        if(tag == 'td' && (where == afterbegin || where == beforeend) ||
//           !tableElRe.test(tag) && (where == beforebegin || where == afterend)) {
//            return;
//        }
//        before = where == beforebegin ? el :
//                 where == afterend ? el.nextSibling :
//                 where == afterbegin ? el.firstChild : null;
//
//        if (where == beforebegin || where == afterend) {
//            el = el.parentNode;
//        }
//
//        if (tag == 'td' || (tag == 'tr' && (where == beforeend || where == afterbegin))) {
//            node = ieTable(4, trs, html, tre);
//        } else if ((tag == 'tbody' && (where == beforeend || where == afterbegin)) ||
//                   (tag == 'tr' && (where == beforebegin || where == afterend))) {
//            node = ieTable(3, tbs, html, tbe);
//        } else {
//            node = ieTable(2, ts, html, te);
//        }
//        el.insertBefore(node, before);
//        return node;
//    }
//
//
//    pub = {
//        /**
//         * Returns the markup for the passed Element(s) config.
//         * @param {Object} o The DOM object spec (and children)
//         * @return {String}
//         */
//        markup : function(o){
//            return createHtml(o);
//        },
//
//        /**
//         * Applies a style specification to an element.
//         * @param {String/HTMLElement} el The element to apply styles to
//         * @param {String/Object/Function} styles A style specification string e.g. 'width:100px', or object in the form {width:'100px'}, or
//         * a function which returns such a specification.
//         */
//        applyStyles : function(el, styles){
//            if (styles) {
//                var matches;
//
//                el = Ext.fly(el);
//                if (typeof styles == "function") {
//                    styles = styles.call();
//                }
//                if (typeof styles == "string") {
//                    /**
//                     * Since we're using the g flag on the regex, we need to set the lastIndex.
//                     * This automatically happens on some implementations, but not others, see:
//                     * http://stackoverflow.com/questions/2645273/javascript-regular-expression-literal-persists-between-function-calls
//                     * http://blog.stevenlevithan.com/archives/fixing-javascript-regexp
//                     */
//                    cssRe.lastIndex = 0;
//                    while ((matches = cssRe.exec(styles))) {
//                        el.setStyle(matches[1], matches[2]);
//                    }
//                } else if (typeof styles == "object") {
//                    el.setStyle(styles);
//                }
//            }
//        },
//
//        /**
//         * Inserts an HTML fragment into the DOM.
//         * @param {String} where Where to insert the html in relation to el - beforeBegin, afterBegin, beforeEnd, afterEnd.
//         * @param {HTMLElement} el The context element
//         * @param {String} html The HTML fragment
//         * @return {HTMLElement} The new node
//         */
//        insertHtml : function(where, el, html){
//            var hash = {},
//                hashVal,
//                setStart,
//                range,
//                frag,
//                rangeEl,
//                rs,
//                temp;
//
//            where = where.toLowerCase();
//            // add these here because they are used in both branches of the condition.
//            hash[beforebegin] = ['BeforeBegin', 'previousSibling'];
//            hash[afterend] = ['AfterEnd', 'nextSibling'];
//
//            if (el.insertAdjacentHTML) {
//                if(tableRe.test(el.tagName) && (rs = insertIntoTable(el.tagName.toLowerCase(), where, el, html))){
//                    return rs;
//                }
//                // add these two to the hash.
//                hash[afterbegin] = ['AfterBegin', 'firstChild'];
//                hash[beforeend] = ['BeforeEnd', 'lastChild'];
//                if ((hashVal = hash[where])) {
//                    el.insertAdjacentHTML(hashVal[0], html);
//                    return el[hashVal[1]];
//                }
//            } else {
//                range = el.ownerDocument.createRange();
//                setStart = 'setStart' + (endRe.test(where) ? 'After' : 'Before');
//                if (hash[where]) {
//                    range[setStart](el);
//                    if (range.createContextualFragment) {
//                        frag = range.createContextualFragment(html);
//                    } else {
//                        frag = document.createDocumentFragment(), 
//                        temp = document.createElement('div');
//                        frag.appendChild(temp);
//                        temp.outerHTML = html;
//                    }
//                    el.parentNode.insertBefore(frag, where == beforebegin ? el : el.nextSibling);
//                    return el[(where == beforebegin ? 'previous' : 'next') + 'Sibling'];
//                } else {
//                    rangeEl = (where == afterbegin ? 'first' : 'last') + 'Child';
//                    if (el.firstChild) {
//                        range[setStart](el[rangeEl]);
//                        frag = range.createContextualFragment(html);
//                        if(where == afterbegin){
//                            el.insertBefore(frag, el.firstChild);
//                        }else{
//                            el.appendChild(frag);
//                        }
//                    } else {
//                        el.innerHTML = html;
//                    }
//                    return el[rangeEl];
//                }
//            }
//            throw 'Illegal insertion point -> "' + where + '"';
//        },
//
//        /**
//         * Creates new DOM element(s) and inserts them before el.
//         * @param {Mixed} el The context element
//         * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
//         * @param {Boolean} returnElement (optional) true to return a Ext.Element
//         * @return {HTMLElement/Ext.Element} The new node
//         */
//        insertBefore : function(el, o, returnElement){
//            return doInsert(el, o, returnElement, beforebegin);
//        },
//
//        /**
//         * Creates new DOM element(s) and inserts them after el.
//         * @param {Mixed} el The context element
//         * @param {Object} o The DOM object spec (and children)
//         * @param {Boolean} returnElement (optional) true to return a Ext.Element
//         * @return {HTMLElement/Ext.Element} The new node
//         */
//        insertAfter : function(el, o, returnElement){
//            return doInsert(el, o, returnElement, afterend, 'nextSibling');
//        },
//
//        /**
//         * Creates new DOM element(s) and inserts them as the first child of el.
//         * @param {Mixed} el The context element
//         * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
//         * @param {Boolean} returnElement (optional) true to return a Ext.Element
//         * @return {HTMLElement/Ext.Element} The new node
//         */
//        insertFirst : function(el, o, returnElement){
//            return doInsert(el, o, returnElement, afterbegin, 'firstChild');
//        },
//
//        /**
//         * Creates new DOM element(s) and appends them to el.
//         * @param {Mixed} el The context element
//         * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
//         * @param {Boolean} returnElement (optional) true to return a Ext.Element
//         * @return {HTMLElement/Ext.Element} The new node
//         */
//        append : function(el, o, returnElement){
//            return doInsert(el, o, returnElement, beforeend, '', true);
//        },
//
//        /**
//         * Creates new DOM element(s) and overwrites the contents of el with them.
//         * @param {Mixed} el The context element
//         * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
//         * @param {Boolean} returnElement (optional) true to return a Ext.Element
//         * @return {HTMLElement/Ext.Element} The new node
//         */
//        overwrite : function(el, o, returnElement){
//            el = Ext.getDom(el);
//            el.innerHTML = createHtml(o);
//            return returnElement ? Ext.get(el.firstChild) : el.firstChild;
//        },
//
//        createHtml : createHtml
//    };
//    return pub;
//}());
