DemoScheduler = Ext.extend(Sch.SchedulerPanel, {
    clicksToEdit: 1,
    rowHeight : 30,
    snapToIncrement: false,
    
    eventRenderer: function (item, resourceRec, tplData, row, col, ds) {
        var bookingStart = item.get('StartDate');
        tplData.style = 'background-color:' + (resourceRec.get('Color') || 'Coral');

        return {
            headerText: bookingStart.format(this.displayDateFormat),
            footerText: item.get('Title') 
        };
    },

    initComponent : function() {
        
        Ext.apply(this, {

            columns: [
                { header: 'Staff', sortable: true, width: 80, dataIndex: 'Name', editor: new Ext.form.TextField() },
                { header: 'Type', sortable: true, width: 120, dataIndex: 'Type', editor: new Ext.form.ComboBox({
                        store: ['Sales', 'Developer', 'Marketing', 'Product manager'],
                        typeAhead: true,
                        forceSelection: true,
                        triggerAction: 'all',
                        selectOnFocus: true
                    })
                },
                //{ header: 'Task Color', sortable: false, width: 100, dataIndex: 'Color', editor: new Ext.form.TextField() },
                {
                    xtype: 'actioncolumn',
                    width: 30,
                    position: 'right',
                    items: [
                        {
                            iconCls : 'delete',  
                            tooltip: 'Clear row',
                            handler: function(scheduler, rowIndex, colIndex) {
                                var els = Ext.fly(scheduler.getView().getRow(rowIndex)).select(scheduler.eventSelector),
                                    rs = [];
                                els.each(function(el) {
                                    rs.push(scheduler.getEventRecordFromElement(el));
                                });
                                scheduler.eventStore.remove(rs);
                            }
                        }
                    ]
                }
            ],

            // Specialized body template with header and footer
            eventBodyTemplate: new Ext.Template(
                '<div class="sch-event-header">{headerText}</div>' +
                '<div class="sch-event-footer">{footerText}</div>'
            ).compile(),

            border: true,
            tbar: [
                {
                    iconCls: 'icon-prev',
                    scale: 'medium',
                    scope : this,
                    handler: function () {
                        this.shiftPrevious();
                    }
                },
                {
                    iconCls: 'icon-next',
                    scale: 'medium',
                    scope : this,
                    handler: function () {
                        this.shiftNext();
                    }
                },
                {
                    id: 'span1',
                    //pressed: true,
                    text: '1 Day',
                    enableToggle: true,
                    toggleGroup: 'span',
                    inputValue: 'red',
                    scope : this,
                    handler: function () {
                        var s = this, 
                            start = s.getStart();

                        start.clearTime();
                        start.setHours(8);
                        s.switchViewPreset('hourAndDay', start, start.add(Date.HOUR, 10));
                    }
                },
                '            ',
                {
                    id: 'span2',
                    enableToggle: true,
                    pressed: true,
                    text: '1 week',
                    toggleGroup: 'span',
                    scope : this,
                    handler: function () {
                        var s = this, 
                            start = s.getStart();
                        
                        start.clearTime();
                        s.switchViewPreset('weekAndDay', start, start.add(Date.DAY, 7));
                    }
                },
                '            ',
                {
                    id: 'span3',
                    enableToggle: true,
                    text: '2 weeks',
                    toggleGroup: 'span',
                    scope : this,
                    handler: function () {
                        var s = this, 
                            start = s.getStart();

                        start.clearTime();
                        s.switchViewPreset('weekAndDay', start, start.add(Date.DAY, 14));
                    }
                }
//                '->',
//                {
//                    iconCls: 'icon-cleardatabase',
//                    tooltip: 'Clear database',
//                    scale: 'medium',
//                    scope : this,
//                    handler: function () {
//                        this.eventStore.removeAll();
//                    }
//                }
            ],

            tooltipTpl: new Ext.XTemplate(
                '<dl class="eventTip">',
                    '<dt class="icon-clock">Time</dt><dd>{[values.StartDate.format("Y-m-d G:i")]}</dd>',
                    '<dt class="icon-task">Task</dt><dd>{Title}</dd>',
                    '<dt class="icon-earth">Location</dt><dd>{Location}&nbsp;</dd>',
                '</dl>').compile(),

            plugins: [
                this.editor = new DemoEditor({
                    // Extra config goes here
                })
            ]
        });

        DemoScheduler.superclass.initComponent.call(this);
    }
});