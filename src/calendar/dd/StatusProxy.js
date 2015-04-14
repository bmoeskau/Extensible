/**
 * A specialized drag proxy that supports a drop status icon, {@link Ext.dom.Layer} styles and auto-repair. It also
 * contains a calendar-specific drag status message containing details about the dragged event's target drop date range.
 * This is the default drag proxy used by all calendar views.
 * @private
 */
Ext.define('Extensible.calendar.dd.StatusProxy', {
    extend: 'Ext.dd.StatusProxy',
    
    /**
     * @cfg {String} moveEventCls
     * The CSS class to apply to the status element when an event is being dragged (defaults to 'ext-cal-dd-move').
     */
    moveEventCls: 'ext-cal-dd-move',
    /**
     * @cfg {String} addEventCls
     * The CSS class to apply to the status element when drop is not allowed (defaults to 'ext-cal-dd-add').
     */
    addEventCls: 'ext-cal-dd-add',

    // Overridden to add a separate message element inside the ghost area.
    // Applies only to Ext 4.1 and above, see notes in constructor
    renderTpl: [
        '<div class="' + Ext.baseCSSPrefix + 'dd-drop-icon" role="presentation"></div>' +
        '<div class="ext-dd-ghost-ct">'+
            '<div id="{id}-ghost" data-ref="ghost" class="' + Ext.baseCSSPrefix + 'dd-drag-ghost" role="presentation"></div>' +
            '<div id="{id}-message" data-ref="message" class="' + Ext.baseCSSPrefix + 'dd-drag-message" role="presentation"></div>' +
        '</div>'
    ],
    
    // applies only to Ext 4.1 and above, see notes in constructor
    childEls: [
        'ghost',
        'message'
    ],
    
    constructor: function(config) {
        // In Ext 4.0.x StatusProxy was a plain class that did not inherit from Component,
        // and all of its els were rendered inside the constructor. Unfortunately, because
        // of this none of the standard Component lifecycle methods apply and so we are left
        // with manually overriding the entire constructor function to inject our custom
        // markup and set up our references.
        //
        // In 4.1 StatusProxy was switched to inherit from Component, so the renderTpl and
        // renderSelectors configs will kick in and generate the proper elements and refs
        // automagically, and will be ignored by 4.0.x.
        if (Ext.getVersion('extjs').isLessThan('4.1')) {
            this.preComponentConstructor(config);
        }
        else {
            this.callParent(arguments);
        }
    },
    
    // applies only to Ext <4.1, see notes in constructor
    preComponentConstructor: function(config) {
        var me = this;
        
        Ext.apply(me, config);
        
        me.id = me.id || Ext.id();
        me.proxy = Ext.createWidget('component', {
            floating: true,
            id: me.id || Ext.id(),
            html: me.renderTpl.join(''),
            cls: Ext.baseCSSPrefix + 'dd-drag-proxy ' + me.dropNotAllowed,
            shadow: !config || config.shadow !== false,
            renderTo: document.body
        });
 
        me.el = me.proxy.el;
        me.el.show();
        me.el.setVisibilityMode(Ext.Element.VISIBILITY);
        me.el.hide();
 
        me.ghost = Ext.get(me.el.dom.childNodes[1].childNodes[0]);
        me.message = Ext.get(me.el.dom.childNodes[1].childNodes[1]);
        me.dropStatus = me.dropNotAllowed;
    },
    
    /**
     * @protected 
     */
    update: function(html) {
        var el = this.getGhost().dom;
        if (typeof html == "string") {
            this.getGhost().setHtml(html);
        } else {
            this.getGhost().setHtml('');
            html.style.margin = "0";
            this.getGhost().dom.appendChild(html);
        }
        if (el) {
            Ext.fly(el).setStyle('float', 'none');
            // If available, set the ghosted event el to autoHeight for visual consistency
            Ext.fly(el).setHeight('auto');
        }
    },
    
    /* @private
     * Update the calendar-specific drag status message without altering the ghost element.
     * @param {String} msg The new status message
     */
    updateMsg: function(msg) {
        this.update(msg);
    }
});