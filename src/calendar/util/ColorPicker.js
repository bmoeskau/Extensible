/**
 * @class Extensible.calendar.util.ColorPicker
 * @extends Ext.picker.Color
 * Simple color picker class for choosing colors specifically for calendars. This is a lightly modified version
 * of the default Ext color picker that is based on calendar ids rather than hex color codes so that the colors
 * can be easily modified via CSS and automatically applied to calendars. The specific colors used by default are
 * also chosen to provide good color contrast when displayed in calendars.
</code></pre>
 * @constructor
 * Create a new color picker
 * @param {Object} config The config object
 * @xtype extensible.calendarcolorpicker
 */
Ext.define('Extensible.calendar.util.ColorPicker', {
    extend: 'Ext.picker.Color',
    alias: 'widget.extensible.calendarcolorpicker',
    
    requires: ['Ext.XTemplate'],
    
    // private
    colorCount: 32,
    
    /**
     * @cfg {Function} handler
     * Optional. A function that will handle the select event of this color picker.
     * The handler is passed the following parameters:<div class="mdetail-params"><ul>
     * <li><code>picker</code> : ColorPicker<div class="sub-desc">The picker instance.</div></li>
     * <li><code>colorId</code> : String<div class="sub-desc">The id that identifies the selected color and relates it to a calendar.</div></li>
     * </ul></div>
     */
    
    constructor: function() {
        this.renderTpl = [
            '<tpl for="colors">',
                '<a href="#" class="x-cal-{.}" hidefocus="on">',
                    '<em><span unselectable="on">&#160;</span></em>',
                '</a>',
            '</tpl>'
        ];
        this.callParent(arguments);
    },
    
    // private
    initComponent: function(){
        this.callParent(arguments);
        
        this.addCls('x-calendar-palette');
            
        if(this.handler){
            this.on('select', this.handler, this.scope || this, {
                delegate: 'a'
            });
        }
        
        this.colors = [];
        for(var i=1; i<=this.colorCount; i++){
            this.colors.push(i);
        }
    },
    
    // private
    handleClick : function(e, t){
        e.preventDefault();
        
        var colorId = t.className.split('x-cal-')[1];
        this.select(colorId);
    },
    
    /**
     * Selects the specified color in the palette (fires the {@link #select} event)
     * @param {Number} colorId The id that identifies the selected color and relates it to a calendar
     * @param {Boolean} suppressEvent (optional) True to stop the select event from firing. Defaults to <tt>false</tt>.
     */
    select : function(colorId, suppressEvent){
        var me = this,
            selectedCls = me.selectedCls,
            value = me.value;
            
        if (!me.rendered) {
            me.value = colorId;
            return;
        }
        
        if (colorId != value || me.allowReselect) {
            var el = me.el;

            if (me.value) {
                el.down('.x-cal-' + value).removeCls(selectedCls);
            }
            el.down('.x-cal-' + colorId).addCls(selectedCls);
            me.value = colorId;
            
            if (suppressEvent !== true) {
                me.fireEvent('select', me, colorId);
            }
        }
    }
});