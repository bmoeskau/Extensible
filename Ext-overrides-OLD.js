Ext.require([
    'Ext.picker.Color',
    'Ext.form.Basic',
    'Ext.data.MemoryProxy'
]);

Extensible.applyOverrides = function() {

    Ext.DomHelper = Ext.core.DomHelper;
    
    Ext.picker.Color.override({
        constructor: function() {
            // use an existing renderTpl if specified
            this.renderTpl = this.renderTpl || Ext.create('Ext.XTemplate', '<tpl for="colors"><a href="#" class="color-{.}" hidefocus="on"><em><span style="background:#{.}" unselectable="on">&#160;</span></em></a></tpl>');
            this.callParent(arguments);
        }
    });
    
    // This was fixed in Ext 4.0.5:
    Ext.layout.container.AbstractCard.override({
        renderChildren: function () {
            // added check to honor deferredRender when rendering children
            if (!this.deferredRender) {
                this.getActiveItem();
                this.callParent();
            }
        }
    });
    
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
};

Ext.onReady(Extensible.applyOverrides);
