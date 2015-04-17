/**
 * The base Model class used by Extensible
 */
Ext.define('Extensible.data.Model', {
    extend: 'Ext.data.Model',
    
    requires: [
        'Ext.util.MixedCollection',
        'Ext.data.field.Date',
        'Ext.data.field.Boolean',
        'Ext.data.field.Field'
    ],
    
    // *Must* be defined by subclasses
    mappingClass: null,
    
    // Should be defined by subclasses, or will default to the default Model id property
    mappingIdProperty: null,
    
    inheritableStatics: {
        /**
         * Reconfigures the default model definition based on the current
         * {@link #mappingClass Mappings} class.
         * @method reconfigure
         * @static
         * @return {Function} The updated constructor function
         */
        reconfigure: function() {
            var proto = this.prototype,
                mappings = Ext.ClassManager.get(proto.mappingClass || ''),
                idProperty = proto.mappingIdProperty,
                prop,
                fields = [],
                i = 0,
                len = 0;
            
            if (!mappings) {
                throw 'The mappingClass for ' + this.$className + ' is undefined or invalid';
            }
            // TODO: Add this as a compile-time warning:
            //if (!idProperty) {
                // idProperty should usually be defined at this point, so make sure it's not missing
            //}
            
            // It is critical that the id property mapping is updated in case it changed, since it
            // is used elsewhere in the data package to match records on CRUD actions:
            proto.idProperty = idProperty || proto.idProperty || 'id';
            
            for (prop in mappings) {
                if(mappings.hasOwnProperty(prop)) {
                    fields.push(mappings[prop]);
                }
            }

            proto.fields.length = 0;
            len = fields.length;

            for (; i < len; i++) {
                if ('date' == fields[i]['type']) {
                    proto.fields.push(Ext.create('Ext.data.field.Date', fields[i]));
                } else if ('boolean' == fields[i]['type']){
                    proto.fields.push(Ext.create('Ext.data.field.Boolean', fields[i]));
                } else if ('int' == fields[i]['type']){
                    proto.fields.push(Ext.create('Ext.data.field.Integer', fields[i]));
                } else {
                    proto.fields.push(Ext.create('Ext.data.field.Field', fields[i]));
                }
            }
            return this;
        }
    },
    
    /**
     * Returns a new instance of this Model with the `data` property deep-copied from the
     * original record. By default the {@link #idProperty} value will be deleted to avoid returning
     * the cloned record with a duplicate id, but you can optionally preserve the id by passing `true`.
     *
     * The behavior is different than the default {@link Ext.data.Model#copy} (which preserves the
     * existing id by default and performs a shallow copy of the data) and is better-suited
     * to the typical default desired behavior when duplicating a record.
     *
     * @param {Boolean} [preserveId=false] True to preserve the record's data {@link idProperty id},
     * false to delete it in the returned clone
     * @return {Extensible.data.Model} The cloned record
     */
    clone: function(preserveId) {
        var copy = Ext.create(this.$className),
            dataProp = 'data';

        copy[dataProp] = Ext.Object.merge({}, this[dataProp]);

        if (preserveId !== true) {
            delete copy[dataProp][this.idProperty];
        }
        return copy;
    }
});