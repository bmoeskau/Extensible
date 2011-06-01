/**
 * @class Ext.ensible.cal.ColorPalette
 * @extends Ext.ColorPalette
 * Simple color palette class for choosing colors specifically for calendars. This is a lightly modified version
 * of the default Ext ColorPalette that is based on calendar ids rather than hex color codes so that the colors
 * can be easily modified via CSS and automatically applied to calendars. The specific colors used by default are
 * also chosen to provide good color contrast when displayed in calendars.
</code></pre>
 * @constructor
 * Create a new ColorPalette
 * @param {Object} config The config object
 * @xtype extensible.calendarcolorpalette
 */
Ext.define('Ext.ensible.cal.ColorPalette', {
    extend: 'Ext.picker.Color',
    alias: 'widget.calendarcolorpalette',
    
    // private
    colorCount: 32,
    
    /**
     * @cfg {Function} handler
     * Optional. A function that will handle the select event of this color palette.
     * The handler is passed the following parameters:<div class="mdetail-params"><ul>
     * <li><code>palette</code> : ColorPalette<div class="sub-desc">The {@link #palette Ext.ensible.cal.ColorPalette} instance.</div></li>
     * <li><code>colorId</code> : String<div class="sub-desc">The id that identifies the selected color and relates it to a calendar.</div></li>
     * </ul></div>
     */
    
    constructor: function() {
        this.renderTpl = Ext.create('Ext.XTemplate', 
            '<tpl for="colors"><a href="#" class="x-cal-color" hidefocus="on">' +
            '<em><span class="x-cal-{.}" unselectable="on">&#160;</span></em></a></tpl>');
        
        this.callParent(arguments);
    },
    
    // private
    initComponent: function(){
        this.callParent(arguments);
        
        this.addCls('x-calendar-palette');
            
        if(this.handler){
            this.on('select', this.handler, this.scope || this, {
                delegate: '.x-cal-color'
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
        
        var cls = t.childNodes[0].childNodes[0].className,
            colorId = cls.split('x-cal-')[1];
            
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