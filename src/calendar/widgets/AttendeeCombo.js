
/*
 * Not currently in use, may or may not be implemented...
 */
Ext.ensible.cal.AttendeeCombo = Ext.extend(Ext.ux.form.SuperBoxSelect, {
    fieldLabel: 'Attendees',
    name: 'attendees',
    anchor:'100%',
    mode: 'local',
    displayField: 'Name',
    valueField: 'AttendeeId',
    classField: 'cls',
    styleField: 'style',
    extraItemStyle: 'border-width:2px'
});

Ext.reg('extensible.attendeecombo', Ext.ensible.cal.AttendeeCombo);
