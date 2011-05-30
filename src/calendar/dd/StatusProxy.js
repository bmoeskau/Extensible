/**
 * @class Ext.ensible.cal.StatusProxy
 * A specialized drag proxy that supports a drop status icon, {@link Ext.Layer} styles and auto-repair. It also
 * contains a calendar-specific drag status message containing details about the dragged event's target drop date range.  
 * This is the default drag proxy used by all calendar views.
 * @constructor
 * @param {Object} config
 */
Ext.define('Ext.ensible.cal.StatusProxy', {
    extend: 'Ext.dd.StatusProxy',
    
    /**
     * @cfg {String} moveEventCls
     * The CSS class to apply to the status element when an event is being dragged (defaults to 'ext-cal-dd-move').
     */
    moveEventCls : 'ext-cal-dd-move',
    /**
     * @cfg {String} addEventCls
     * The CSS class to apply to the status element when drop is not allowed (defaults to 'ext-cal-dd-add').
     */
    addEventCls : 'ext-cal-dd-add',
    
//    // private
//    constructor: function(config){
//        Ext.apply(this, config);
//        this.id = this.id || Ext.id();
//        this.proxy = Ext.createWidget('component', {
//            floating: true,
//            id: this.id,
//            html: '<div class="' + Ext.baseCSSPrefix + 'dd-drop-icon"></div>' +
//                  '<div class="' + Ext.baseCSSPrefix + 'dd-drag-ghost"><div class="ext-dd-msg"></div></div>',
//            cls: Ext.baseCSSPrefix + 'dd-drag-proxy ' + this.dropNotAllowed,
//            shadow: !config || config.shadow !== false,
//            renderTo: document.body
//        });
//
//        this.el = this.proxy.el;
//        this.el.show();
//        this.el.setVisibilityMode(Ext.core.Element.VISIBILITY);
//        this.el.hide();
//
//        this.ghost = Ext.get(this.el.dom.childNodes[1]);
//        this.dropStatus = this.dropNotAllowed;
//    },
//    constructor: function(config) {
//        Ext.apply(this, config);
//        this.id = this.id || Ext.id();
//        this.el = new Ext.Layer({
//            dh: {
//                id: this.id, cls: 'ext-dd-drag-proxy x-dd-drag-proxy '+this.dropNotAllowed, cn: [
//                    {cls: 'x-dd-drop-icon'},
//                    {cls: 'ext-dd-ghost-ct', cn:[
//                        {cls: 'x-dd-drag-ghost'},
//                        {cls: 'ext-dd-msg'}
//                    ]}
//                ]
//            }, 
//            shadow: !config || config.shadow !== false
//        });
//        this.ghost = Ext.get(this.el.dom.childNodes[1].childNodes[0]);
//        this.message = Ext.get(this.el.dom.childNodes[1].childNodes[1]);
//        this.dropStatus = this.dropNotAllowed;
//    },

    // inherit docs
    update : function(html){
        if(typeof html == 'string'){
            this.ghost.update(html);
        }else{
            this.ghost.update('');
            html.style.margin = '0';
            this.ghost.dom.appendChild(html);
        }
        var el = this.ghost.dom.firstChild;
        if(el){
            Ext.fly(el).setStyle('float', 'none').setHeight('auto');
            Ext.getDom(el).id += '-ddproxy';
        }
    },
    
    /* @private
     * Update the calendar-specific drag status message without altering the ghost element.
     * @param {String} msg The new status message
     */
    updateMsg : function(msg){
        //this.message.update(msg);
    }
});