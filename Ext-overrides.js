Extensible.applyOverrides = function() {

    Ext.DomHelper = Ext.core.DomHelper;
    
    Ext.picker.Color.override({
        constructor: function() {
            // use an existing renderTpl if specified
            this.renderTpl = this.renderTpl || Ext.create('Ext.XTemplate', '<tpl for="colors"><a href="#" class="color-{.}" hidefocus="on"><em><span style="background:#{.}" unselectable="on">&#160;</span></em></a></tpl>');
            this.callParent(arguments);
        }
    });
    
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

    // Currently MemoryProxy really only functions for read-only data. Since we want
    // to simulate CRUD transactions we have to at the very least allow them to be
    // marked as completed and successful, otherwise they will never filter back to the
    // UI components correctly.
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
};

Ext.onReady(Extensible.applyOverrides);
