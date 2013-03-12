// A simple preconfigured editor plugin
DemoEditor = Ext.extend(Sch.plugins.EventEditor, {
    height : 180,
    width : 270,
    buttonAlign : 'left',
    
    initComponent : function() {
        Ext.apply(this, {
            fieldsPanelConfig : {
                layout : 'hbox',
                style:'background:#fff',
                border : false,
                cls : 'editorpanel',
                labelAlign : 'top',
                items : [
                    {
                        xtype : 'container',
                        cls : 'image-ct',
                        items : this.img = new Ext.BoxComponent({
                            cls : 'profile-image',
                            autoEl : 'img'
                        }),
                        width : 110
                    },
                    {
                        padding : 10,
                        labelAlign : 'top',
                        style:'background:#fff',
                        border : false,
                        layout : 'form',
                        flex : 2,
                        defaults : {
                            width : 135
                        },
                        items : [
                            this.titleField = new Ext.form.TextField({
                                name : 'Title',
                                fieldLabel : 'Task'
                            }),
                    
                            this.locationField = new Ext.form.TextField({
                                name : 'Location',
                                fieldLabel : 'Location'
                            })
                        ]
                    }
                ]
            }
        });

        this.on('expand', this.titleField.focus, this.titleField);
        DemoEditor.superclass.initComponent.apply(this, arguments);
    },

    show : function(eventRecord) {
        // Load the image of the resource
        this.img.el.dom.src = this.scheduler.getResourceByEventRecord(eventRecord).get('ImgUrl');
        DemoEditor.superclass.show.apply(this, arguments);
    },
    
    onEventCreated : function(newEventRecord, resourceRecord, e) {
        if(newEventRecord.phantom){
            // Overridden to provide some default values on create
            newEventRecord.set('Title', 'New task...');
            newEventRecord.set('Location', 'Local office');
            DemoEditor.superclass.onEventCreated.apply(this, arguments);
        }
    }
});