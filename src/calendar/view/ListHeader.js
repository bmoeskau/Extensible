/**
 * @class Extensible.calendar.view.ListHeader
 * @extends Ext.form.Panel
 *
 * <p><b>This class is currently beta code and the API is still subject to change before the next release.</b></p>
 *
 * <p>This is the header area container within the {@link Extensible.calendar.view.List List} view. Normally you should
 * not need to use this class directly -- instead you should use {@link Extensible.calendar.view.List List} view which
 * aggregates this class and the {@link Extensible.calendar.view.ListBody ListBody} view into a single unified view
 * presented by {@link Extensible.calendar.CalendarPanel CalendarPanel}.</p>
 *
 * <p>This header consists of a form and a toolbar. Both can easily be extended or hidden. The header form is intended
 * to host filter and display configuration settings while the toolbar is useful to offers actions that can be applied
 * to the list of events, for example to add events or print events.</p>
 *
 * <p>To modify or hide the form and the toolbar, override functions {@link #getFormConfig} and {@link #getToolbarConfig}.
 * The form field values will be submitted automatically as parameters of requests to load the event store. They can
 * be used on the backend to select or filter events.</p>
 *
 * @author Gabriel Sidler, sidler@teamup.com
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Extensible.calendar.view.ListHeader', {
    extend: 'Ext.form.Panel',
    alias: 'widget.extensible.listheaderview',

    requires: [
        'Ext.form.ComboBox',
        'Ext.Button',
        'Ext.data.Store',
        'Ext.tip.QuickTipManager'
    ],

    /**
     * @property ownerCalendarView
     * @type Ext.Container
     * A reference to the calendar view that hosts this view. Read-only.
     */

    /**
     * @cfg {Boolean} readOnly
     * True to prevent the view from providing CRUD capabilities, false to enable CRUD (the default).
     */

    /**
     * @cfg {String} dateRangeOneDay
     * The text used for date range option <i>one day</i>.
     */
    dateRangeOneDay: 'One day',

    /**
     * @cfg {String} dateRangeOneWeek
     * The text used for date range option <i>one week</i>.
     */
    dateRangeOneWeek: 'One week',

    /**
     * @cfg {String} dateRangeOneMonth
     * The text used for date range option <i>one month</i>.
     */
    dateRangeOneMonth: 'One month',

    /**
     * @cfg {String} dateRangeThreeMonths
     * The text used for date range option <i>3 months</i>.
     */
    dateRangeThreeMonths: 'Three months',

    /**
     * @cfg {String} dateRangeOneYear
     * The text used for date range option <i>one year</i>.
     */
    dateRangeOneYear: 'One year',

    /**
     * @cfg {String} dateRangeText
     * The label text used for the date range field.
     */
    dateRangeText: 'Date range',

    /**
     * @cfg {String} showDetailsText
     * The label text used for the details field.
     */
    showDetailsText: 'Show details',

    /**
     * @cfg {String} addBtnText
     * The caption used for the add button.
     */
    addBtnText: 'Add event',

    /**
     * @cfg {String} resetBtnText
     * The caption used for the reset button.
     */
    resetBtnText: 'Reset',

    /**
     * @cfg {String} dateRangeDefault
     * Defines the default value for the date range input field. Defaults to <tt>month</tt>. See
     * {@link #getDateRangeOptions} for a list of supported date range default values.
     */
    dateRangeDefault: 'month',

    /**
     * @cfg {Boolean} showDetailsDefault
     * Defines the default value for the checkbox to show details. Defaults to <tt>false</tt>.
     */
    showDetailsDefault: false,

    // private configs
    preventHeader: true,
    autoHeight: true,
    border: 0,
    defaults: {
        labelWidth: 100
    },


    // private
    initComponent : function(){
        var tbItems = this.getToolbarConfig();

        this.dateRangeOptions = this.getDateRangeOptions();

        this.items = this.getFormConfig();
        if (this.items.length == 0) {
            this.bodyStyle = {padding: '0px', border: 0};
        } else {
            this.bodyStyle = {padding: '10px 10px 5px 10px'};
        }

        if (tbItems.length > 0) {
            this.dockedItems = [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'default',
                cls: 'ext-cal-list-hd-tb',
                items: tbItems
            }];
        }

        if (this.items.length == 0 && tbItems.length == 0) {
            this.style = {borderBottom: '0px'};
        }

        this.callParent(arguments);

        this.addEvents({
            /**
             * @event formchange
             * Fires after the filter form changes.
             * @param {Extensible.calendar.view.ListHeader} this
             * @param {Ext.form.Basic} form The filter form.
             * @param {Ext.form.field.Field} field Form field that changed.
             * @param {Object} newValue New form field value.
             * @param {Object} oldValue Old form field value.
             * @param {Object} eOpts The options object passed to {@link Ext.util.Observable.addListener}.
             */
            formchange: true,

            /**
             * @event addevent
             * Fires after the user clicks the add event button.
             * @param {Extensible.calendar.view.ListHeader} this
             * @param {Ext.button.Button} button The button clicked.
             * @param {Event} event
             * @param {Object} eOpts The options object passed to {@link Ext.util.Observable.addListener}.
             */
            addevent: true
        });

    },

    /**
     * <p>This function is called by this form panel to obtain the definition of form fields. Override this function to
     * modify the form fields displayed by this panel.</p>
     * @return {Array} An array of Object
    */
    getFormConfig: function() {
        return [{
           xtype:          'combo',
           id:             this.id+'-daterange',
           mode:           'local',
           value:          this.dateRangeDefault,
           triggerAction:  'all',
           forceSelection: true,
           editable:       false,
           width:          220,
           fieldLabel:     this.dateRangeText,
           name:           'period',
           displayField:   'name',
           valueField:     'value',
           queryMode:      'local',
           store:          Ext.create('Ext.data.Store', {
               fields : ['name', 'value'],
               data   : this.dateRangeOptions
           }),
           // This fixes a bug that a blank item is not properly supported. See Sencha forum and source of Ext.view.BoundList.
           // http://www.sencha.com/forum/showthread.php?41431-Empty-string-as-ComboBox-entry-text&p=195882
           tpl: '<ul><tpl for="."><li role="option" class="x-boundlist-item">{name}&nbsp;</li></tpl></ul>',
           listeners: {
               change: {fn: this.onFormChange, scope: this}
           }
        },{
            xtype:          'checkboxfield',
            id:             this.id+'-showdetails',
            value:          this.showDetailsDefault,
            inputvalue:     '1',
            fieldLabel:     this.showDetailsText,
            name:           'details',
            listeners: {
                change: {fn: this.onFormChange, scope: this}
            }
        }];
    },

    /**
     * <p>This function is called by this form panel to obtain the definition of the toolbar content. Override this function to
     * modify what goes into the toolbar. If no toolbar is required, return an empty array from this function.</p>
     * @return {Array} An array of Object.
     */
    getToolbarConfig: function() {
        var result = [];
        if (this.readOnly !== true) {
            result.push({
                text   : this.addBtnText,
                listeners: {
                    click: {
                        fn: this.onAddEvent,
                        scope: this
                    }
                }
            });
        }
        result.push(
            '->',
            {
                text   : this.resetBtnText,
                handler: function() {
                    this.up('form').getForm().reset();
                }
            }
        );
        return result;
    },

    /**
     * <p>Returns the options available in the date range combo box. Override this function to change the available
     * options for the date range select list.</p>
     * <p>Returns an array of objects where each object has two attributes <tt>name</tt> and <tt>value</tt>. The
     * attribute <tt>name</tt> is the display string, the attribute <tt>value</tt> is the value returned as the
     * field value of the combo box. The default configuration is: <pre><code>
[
     {name : 'One Day',   value: 'day'},
     {name : 'One Week',  value: 'week'},
     {name : 'One Month',  value: 'month'},
     {name : '3 Months',  value: '3months'},
     {name : 'One Year', value: 'year'}
]
     </code></pre></p>
     * @return {Object}
     */
    getDateRangeOptions: function() {
        return [
            {name : this.dateRangeOneDay,   value: 'day'},
            {name : this.dateRangeOneWeek,  value: 'week'},
            {name : this.dateRangeOneMonth,  value: 'month'},
            {name : this.dateRangeThreeMonths,  value: '3months'},
            {name : this.dateRangeOneYear, value: 'year'}
        ];
    },

    /* Private
     * Event handler that is called when the form changes.
     * @param {Ext.form.field.Field} field
     * @param {Object} newValue
     * @param {Object} oldValue
     * @param {Object} eOpts
     */
    onFormChange: function(field, newValue, oldValue, eOpts){
        this.fireEvent('formchange', this, this.getForm(), field, newValue, oldValue, eOpts);
    },

    /* Private
     * Event handler that is called when the user clicks on the add event button.
     * @param {Extensible.calendar.view.ListHeader} this
     * @param {Ext.button.Button} bt
     * @param {Event} e
     * @param {Object} eOpts
     */
    onAddEvent: function(bt, e, eOpts){
        this.fireEvent('addevent', this, bt, e, eOpts);
    },

    // private
    afterRender : function(){
        this.addCls('ext-cal-list-hd');
        this.callParent(arguments);
    },

    // private
    refresh : function(reloadData){
        Extensible.log('refresh (ListHeader)');
        this.callParent(arguments);
    },

    /**
     * This method is called by the {@link Extensible.calendar.view.List List} view that hosts this header when the user chooses to
     * move to a new date. The current implementation does nothing but can be overriden to update the header form if
     * necessary.
     * @param {Date} dt The new view start date.
     */
    moveTo : function(dt){
    }

});