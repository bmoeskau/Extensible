/**
 * @class Ext.ensible.cal.ColorPalette
 * @extends Ext.ColorPalette
 * Simple color palette class for choosing colors specifically for calendars.
</code></pre>
 * @constructor
 * Create a new ColorPalette
 * @param {Object} config The config object
 * @xtype colorpalette
 */
Ext.ensible.cal.ColorPalette = Ext.extend(Ext.ColorPalette, {
    colors: ['1','2','3'],
    
    initComponent: function(){
        Ext.ensible.cal.ColorPalette.superclass.initComponent.call(this);
        this.addClass('x-calendar-palette');
        this.tpl = new Ext.XTemplate('<tpl for="."><a class="x-cal-color" id="' + this.id +
            '-color-{.}" href="#" unselectable="on" hidefocus="on"><em><span class="x-cal-{.}">&#160;</span></em></a></tpl>');
    },
    
    handleClick : function(e, t){
        e.preventDefault();
        var el = e.getTarget('.x-cal-color', 3, true);
        if(el){
            var id = el.id.split('-color-')[1];
            this.select(id);
        }
    },
    
    select : function(colorId, suppressEvent){
        if(colorId != this.value){
            if(this.value){
                Ext.fly(this.id+'-color-'+this.value).removeClass('x-color-palette-sel');
            }
            Ext.get(this.id+'-color-'+colorId).addClass('x-color-palette-sel');
            this.value = colorId;
            
            if(suppressEvent !== true){
                this.fireEvent('select', this, colorId);
            }
        }
    }
});

Ext.reg('extensible.calendarcolorpalette', Ext.ensible.cal.ColorPalette);