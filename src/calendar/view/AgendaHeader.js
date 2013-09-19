/**
 * @class Extensible.calendar.view.AgendaHeader
 * @extends Ext.form.Panel
 *
 * <p><b>This class is currently beta code and the API is still subject to change before the next release.</b></p>
 *
 * <p>This is the header area container within the {@link Extensible.calendar.view.Agenda Agenda} view. Normally you should
 * not need to use this class directly -- instead you should use {@link Extensible.calendar.view.Agenda Agenda} view which
 * aggregates this class and the {@link Extensible.calendar.view.AgendaBody AgendaBody} view into a single unified view
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
Ext.define('Extensible.calendar.view.AgendaHeader', {
    extend: 'Ext.form.Panel',
    alias: 'widget.extensible.agendaheaderview',

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
     * @cfg {Boolean} simpleList
     * <p>If true, a simple list of events is displayed, else, an agenda-style list is displayed.
     * Defaults to false.</p>
     */
    simpleList: false,

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
     * @cfg {String} groupByMonths
     * The text used for group by option <i>Month</i>.
     */
    groupByMonths: 'Month',

    /**
     * @cfg {String} groupByWeek
     * The text used for group by option <i>Week</i>.
     */
    groupByWeek: 'Week',

    /**
     * @cfg {String} groupByNone
     * The text used for group by option <i>None</i>.
     */
    groupByNone: 'None',

    /**
     * @cfg {String} groupByText
     * The label text used for the group by field.
     */
    groupByText: 'Group by',

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
     * @cfg {String} groupBy
     * Defines the default value for the groupby input field. Defaults to <tt>none</tt>. See
     * {@link #getGroupByOptions} for a list of supported default values.
     */
    groupBy: 'none',

    /**
     * @cfg {Boolean} showDetailsDefault
     * Defines the default value for the checkbox to show details. Defaults to <tt>false</tt>.
     */
    showDetailsDefault: false,

    // private configs
    cls: 'ext-cal-agenda-hd',
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
        this.groupByOptions = this.getGroupByOptions();

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
                cls: 'ext-cal-agenda-hd-tb',
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
             * @param {Extensible.calendar.view.AgendaHeader} this
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
             * @param {Extensible.calendar.view.AgendaHeader} this
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
        var formItems = {
            xtype: 'fieldcontainer',
            labelWidth: 100,
            height: 45,
            fieldDefaults: {
                // padding: 20,
                labelAlign: 'top',
                width: 150,
                margins: '0 20 0 0'
            },
            layout: 'hbox',
            items: [{
                xtype:          'combo',
                id:             this.id+'-daterange',
                mode:           'local',
                value:          this.dateRangeDefault,
                triggerAction:  'all',
                forceSelection: true,
                editable:       false,
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
                tpl: '<ul><tpl for="."><li role="option" class="x-boundlist-item">{name}&nbsp;</li></tpl></ul>'
            }]
        };

        if (this.simpleList) {
            formItems.items.push({
                xtype:          'combo',
                id:             this.id+'-groupby',
                mode:           'local',
                value:          this.groupBy,
                triggerAction:  'all',
                forceSelection: true,
                editable:       false,
                fieldLabel:     this.groupByText,
                name:           'groupby',
                displayField:   'name',
                valueField:     'value',
                queryMode:      'local',
                store:          Ext.create('Ext.data.Store', {
                    fields : ['name', 'value'],
                    data   : this.groupByOptions
                }),
                // This fixes a bug that a blank item is not properly supported. See Sencha forum and source of Ext.view.BoundList.
                // http://www.sencha.com/forum/showthread.php?41431-Empty-string-as-ComboBox-entry-text&p=195882
                tpl: '<ul><tpl for="."><li role="option" class="x-boundlist-item">{name}&nbsp;</li></tpl></ul>'
            });
        }

        formItems.items.push({
            xtype:          'checkboxfield',
            id:             this.id+'-showdetails',
            value:          this.showDetailsDefault,
            inputvalue:     '1',
            fieldLabel:     this.showDetailsText,
            name:           'details'
        });

        return [formItems];
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
                text: this.addBtnText,
                iconCls: 'ext-cal-icon-evt-add',
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

    /**
     * <p>Returns the options available in the group by combo box. Override this function to change the available
     * options for the group by select list.</p>
     * <p>Returns an array of objects where each object has two attributes <tt>name</tt> and <tt>value</tt>. The
     * attribute <tt>name</tt> is the display string, the attribute <tt>value</tt> is the value returned as the
     * field value of the combo box. The default configuration is: <pre><code>
     [
     {name : 'None',   value: 'none'},
     {name : 'Month',  value: 'month'},
     {name : 'Week',  value: 'week'}
     ]
     </code></pre></p>
     * @return {Object}
     */
    getGroupByOptions: function() {
        return [
            {name : this.groupByNone,  value: 'none'},
            {name : this.groupByMonths, value: 'month'},
            {name : this.groupByWeek,  value: 'week'}
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
        this.saveState();
    },

    /* Private
     * Event handler that is called when the user clicks on the add event button.
     * @param {Extensible.calendar.view.AgendaHeader} this
     * @param {Ext.button.Button} bt
     * @param {Event} e
     * @param {Object} eOpts
     */
    onAddEvent: function(bt, e, eOpts){
        this.fireEvent('addevent', this, bt, e, eOpts);
    },

    // private
    afterRender : function(){
        this.callParent(arguments);

        this.dateRangeField = this.down('#' + this.id + '-daterange');
        this.dateRangeField.setValue(this.dateRangeDefault);
        this.dateRangeField.on('change', this.onFormChange, this);
        this.groupByField = this.down('#' + this.id + '-groupby');
        if (this.groupByField) {
            this.groupByField.setValue(this.groupBy);
            this.groupByField.on('change', this.onFormChange, this);
        }
        this.showDetailsCheckbox = this.down('#' + this.id + '-showdetails');
        this.showDetailsCheckbox.setValue(this.showDetailsDefault);
        this.showDetailsCheckbox.on('change', this.onFormChange, this);
    },

    // private
    refresh : function(reloadData){
        Extensible.log('refresh (AgendaHeader)');
        this.callParent(arguments);
    },

    /**
     * This method is called by the {@link Extensible.calendar.view.Agenda Agenda} view that hosts this header when the user chooses to
     * move to a new date. The current implementation does nothing but can be overriden to update the header form if
     * necessary.
     * @param {Date} dt The new view start date.
     */
    moveTo : function(dt){
    },

    /**
     * Returns the state to be persisted in a browser cookie. This implements function getState()
     * from mixin Ext.state.Stateful.
     * @return {Object}
     */
    getState: function() {
        var state = {
            daterange: this.dateRangeField.getValue(),
            showdetails: this.showDetailsCheckbox.getValue()
        };
        if (this.groupByField) {
            state.groupby = this.groupByField.getValue();
        }
        return state;
    },

    /**
     * Function is called in the constructor to restore the state. This implements function applyState()
     * from mixin Ext.state.Stateful.
     * @param {Object} state See function getState() for the structure of state.
     */
    applyState: function(state) {
        if (state) {
            if (state.daterange) {
                var dateRangeValues = this.getDateRangeOptions();
                for (var i = 0; i < dateRangeValues.length; i++ ) {
                    var option = dateRangeValues[i];
                    if (option.value == state.daterange) {
                        this.dateRangeDefault = state.daterange;
                        break;
                    }
                }
            }
            if (state.showdetails === true || state.showdetails === false) {
                this.showDetailsDefault = state.showdetails;
            }
            if (state.groupby) {
                var groupByValues = this.getGroupByOptions();
                for (var i = 0; i < groupByValues.length; i++ ) {
                    var option = groupByValues[i];
                    if (option.value == state.groupby) {
                        this.groupBy = state.groupby;
                        break;
                    }
                }
            }
        }
    }

});