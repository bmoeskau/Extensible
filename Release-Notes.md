# Extensible Release Notes

These notes apply to the Ext 4.x branch of Extensible.

## 1.6.0 (Beta)

_August 9, 2012_

**New Features**

* Recurrence! This is the main feature of this release, and it includes lots of specific things:
    - Rewrote the previous experimental recurrence selection component from scratch (now `FrequencyCombo`)
    - 10 classes under the new `Extensible.form.recurrence` namespace
    - RangeEditPanel/Window components for editing recurring events
    - New server-side recurrence example with a default PHP implementation
* Copy events:
    - Added new option to copy (clone) events in the event context menu
    - Also supports holding Ctrl/Alt/Cmd while dragging an event to copy it
    - New `copyToText` config and `eventcopy` event
* Exception handling improvements:
    - New `eventexception` event raised by views and CalendarPanel when proxies return an exception
    - New `AnbstractCalendar.notifyOnException()` template method that defaults to showing an Ext MessageBox with exception messages
    - New view configs: `notifyOnExceptionTitle`, `notifyOnExceptionText` and `notifyOnExceptionDefaultMessage`
* New `Extensible.data.Model` abstract class to encapsulate some generic logic for Extensible models
* Other new config options:
    - `allowDefaultAdd` config in `EventDetails` and `EventEditWindow` forms to control the behavior of clicking the "Save" button on an unmodified form
    - `morePanelMinWidth` config to control the width of the "More events" popup in Month view
    - `minBodyHeight` config in Day view to control event overflow and scrolling when many events are displayed in the header area

**Bugs Fixed**

* Fixed bad empty day cell ids causing "date is undefined" error
* Fixed dirty checking logic in event edit forms
* Updated a few leftover Ext 3.x class references
* The "More events" popup will now scroll vertically when the number of events causes overflow
* Override for `Ext.form.CheckboxGroup.resetOriginalValue()` to fix issues with the Ext 4.0.x implementation
* Fixed null error when changing calendar views in certain situations
* Fix for an Ext 4.1 bug where the `Panel.frameSize` property is not always set as expected and can cause null errors
* Fixed bug that caused record add operations after an initial validation failure to not be saved properly
* Updated exception code to listen to the proxy rather than the store for exceptions (an Ext 4.x change)
* Fixed: In weeks that *only* contained partial events spanning from previous weeks, the empty placeholder cells were not calculated correctly, leaving "dead" spots in the calendar that were not clickable.
* Fixed "long clicks" on events that get interpreted as drag starts that were not properly initialized and caused errors
* Changed the event and calendar mapping assignments to use `Ext.apply` to make them easier to partially override
* Fixed a bug in the `CalendarListPanel` that could cause the calendar visibility toggling behavior to break
* Fixed hard-coded event selector logic that could break with deeply-nested custom event body markup
* Fixed invalid references to `Ext.Element.fly` that caused the invalid drop repair action to fail during drag drop

## 1.5.1

_February 6, 2012_

**New Features**

* Added Extensible-config.js for easier example path configuration (they now work out of the box by default)

**Bugs Fixed**

* Lots of fixes due to changes in the upcoming Ext 4.1 release
    - Fixed Ext.data.Reader override due to internal refactoring that broke the override
    - The XTemplate rendering process changed, forcing adjustments to all of the calendar templates
    - Ext.dd.StatusProxy now extends Component, so the Extensible subclass had to be updated also
    - Fixed field anchoring in the event form
    - Refactored the DateRange field -- the old version did not work under the new layout changes
    - Fixed a bug that broke the positioning of the CalendarCombo icon
    - Form CSS tweaks
    - Fixed how the CalendarPanel's toolbar items are initialized
    - Fixed FF-only positioning bug in CalendarCombo introduced by field layout switch to tables as wrappers
* Default all views to `hideMode: offsets` to preserve scroll position cross-browser
* Fixed logic that sets the active view and navigation state on initial load
* Refactored event rendering in month view to fix issues with some complex overlapping scenarios
* Fixed issue with duplicate remote loads when switching views
* Fixed potential null error in MemoryEventStore
* Fixed an edge case that could cause certain events not to show up in the Day view header
* Added null check to avoid errors when calculating the event rendering grid if the maxEvents array is empty
* Fix calendar start date not getting set correctly in some cases
* Added safety checks around all Ext overrides to avoid errors if any classes are not present
* Fixed EventWindow animateTarget not working
* Fixed calendar to fire `eventclick` always, even when the calendar is read-only
* Fixed IE9-specific scroll reset on click bug

## 1.5.0

_October 14, 2011_

**New Features**

* Added Italian locale
* Added `Extensible.form.field.DateRange.timeFormat` config
* Added `Extensible.Date` utility methods: `isMidnight()`, `isToday()`, and `today()`

**Bugs Fixed**

* Refactored `Extensible.Date.add` to fix daylight savings-related bugs
* Fixed Ext JS CSS class prefixes that were renamed `.ext-` to `.x-` in Ext 4
* Fixed scrollbar width offset bug introduced by OSX Lion's new scrollbars
* DateRange field `singleLine` config honored properly again
* Added AbstractCard.renderChildren override to work around an Ext card layout bug
* Fixed error with sample data file name case-sensitivity
* Fix to ensure that CalendarPanel fires the `viewchange` event after initial render
* Fix CalendarPanel title updating correctly in the TestApp sample
* German locale updates
* Fixed drag-to-create not working in AbstractCalendar
* Fix MonthDetailView to properly honor the `enableContextMenu` config
* Fix toolbar hiding/showing when switching to detailed edit form
* Fix calendar colors for IE/Opera
* Fixed calendar render bug when resizing an event to end at midnight
* Patched an Ext bug related to component ids when no explicit id assigned to a CalendarPanel
* Fixed view end date getting modified incorrectly by event handlers
* Change to enforce exact, case-sensitive matching on event ids during selection
* Added `constrain: true` as a default config for EventWindow
* Added a `destroy` method to the DropZone to fix dd shims not working in some cases
* Fixed `Ext.data.MemoryProxy` override to commit in-memory records after save to avoid rejecting previous changes on cancel
* Fixed view boundary bug related to setting a static start date on views with &lt; 7 days
* Fixed off-by-one pixel issues with aligning events in the day/week views in various browsers

**Known Issues**

* The dd.ScrollManager seems to have some serious issues in 4.x at the moment, and so support for automatic container scrolling during drag in the calendar day/week views has been temporarily removed. It will be reinstated in a future release once this is resolved.

## 1.5.0 (Beta)

_June 23, 2011_

This release is strictly for implementing Ext 4 support in the calendar components. It includes all the changes from 1.0.1 (ported to Ext 4 if needed), but no new features were implemented or bugs fixed outside of the 1.0.x branch that weren't specific to Ext 4. Going forward the master (1.5+) branch of Extensible will maintain Ext 4 support, and the 1.x branch of Extensible will remain on Ext 3.x.

**API Changes**

* Every single class in Extensible has been renamed and/or re-namespaced, both for consistency with Ext 4 conventions and also to improve overall organization. While this is a breaking change, there is a compatibility file (`extensible-1.0-compat.js`) that should make this seamless. While you should definitely rename the Extensible references in your app code long-term, you should be able to run with the compat file loaded with no other changes (though you'll likely need to make other changes in general to support Ext 4 if you are porting existing Ext 3.x app code).
* Unfortunately the Ext 4 server proxies now send a `start` param by default with all requests, which overrides the start date value sent by the calendar since it was using the same default param name. Because of this `CalendarView.dateParamStart` now defaults to `startDate` (and `CalendarView.dateParamEnd` defaults to `endDate` for consistency). Server code that evaluates either of these params will have to be updated accordingly.

**Known issues**

* The DateTime picker currently only supports single-line (non-stacked) configuration, and may get cut off in fixed-width containers. This will be fixed in the next release.
* IE has a mysterious black border around all-day and spanning events
* The Extensible API documentation has not yet been updated to reflect all the changes in this release


---

The 1.0.x releases below were based on Ext 3.x. After the 1.0.1 release Extensible was branched to 1.5.x for Ext 4 support. The Extensible 1.0.x release notes are now maintained in the [1.0.x branch](https://github.com/bmoeskau/Extensible/tree/1.x) only going forward, but these notes are kept here for historical purposes.

---

## 1.0.1 - Ext 3

_June 23, 2011_

**New Features**

* Added locales: German, Croatian, Czech, Chinese (traditional and simplified)
* Added `Ext.ensible.Date.isWeekend()` and `Ext.ensible.Date.isWeekday()`
* Added support for custom weekend day styles in calendar views
* New calendar view configs for controlling special day styles more easily (`weekendCls`, `prevMonthCls`, `nextMonthCls` and `todayCls`)
* New _experimental_ calendar examples (not linked from the main examples page, but available under /examples/calendar/experimental)

**Bugs Fixed**

* Fixed bug that could cause the times shown in the gutter of the day view to be wrong the day after a daylight savings change
* Fixed dayNames override in Portuguese-BR locale
* Updated all locale files to use pluralization functions instead of strings for certain attributes (primarily to support Czech properly)
* Updated DayView to fire the `beforeeventresize` event with start and end date arguments
* Fix for event handling code accessing the active calendar view on date change to get the correct view
* Updated the CSS rules for the ColorPalette so that it works correctly when used outside of the calendar list menu
* Updated view templates to avoid an Ext regression bug when moving to the Ext 4.0 version of XTemplate
* Fixed several minor offset bugs in calendar drag/drop, including the initial lag when dragging that could offset the pointer incorrectly

## 1.0

_March 1, 2011_

**New Features**

* Updated the calendar + scheduler combo example

**Bugs Fixed**

* Changed `recurrenceLabelText` to `repeatsLabelText` in locale files to match code
* Fix CalendarPanel to properly relay the view's `beforeeventdelete` event
* Fix so that file order is not important when declaring classes in the `Ext.ensible.sample` namespace
* Updates to `MemoryEventStore` to handle batched records and initial record phantom status
* Fix null error on remote calendar list store load
* Fixed issues related to store `autoSave` support
* Fix intermittent null error on event drag when browser is slow to respond
* Various minor fixes related to managing event data during remote save/errors
* Remove extra body top border added by Ext when there is no panel header

## 1.0 (RC 2)

_Feb. 20, 2011_

**New Features**

* New TabPanel example
* Added Polish locale
* New CalendarView configs `dateParamStart` &amp; `dateParamEnd` to allow overriding the param names sent for read requests
* Switched CalendarView `getStoreParams`, `reloadStore` and `refresh` methods from private to public/documented
* Added new CalendarView `getStoreDateParams` method to separate default date params from custom param logic
* The CalendarCombo widget now defaults to `selectOnFocus:true`
* Enabled context menu support on "More events" popup panel
* Added default CRUD user messaging to all the examples

**Bugs Fixed**

* Case typo in event rowspan code that caused problems in Chrome
* "More events" window height grows after each display
* Improved logic that calculates size for the "more events" link
* Drag-to-create start position bug in day/week views
* CalendarCombo invalid value could break the example application
* Double POST after remote save fails
* Disable store autoSave if set so that the calendar can properly manage saving instead
* MemoryProxy override fix to always process the callback fn after any request
* Switched store logic to handle 'write' event instead of individual CRUD events for proper remote response handling
* PHP 'fail' test flag (specific to the remote sample) not working for DELETE transactions in some cases
* DomHelpr override for IE9's apparent removal of `createContextualFragment` which breaks everything (general to Ext also)
* Switched all examples to HTML5 doc type to default to standards mode rendering (mainly for IE)
* Drag offset bug when dragging quickly to move an event
* Display offset bug in setting the calendar view bounds when startDay > 0

## 1.0 (RC 1)

_Jan. 26, 2011_

**New Features**

* Lots of new options to customize the time increments and boundaries that can be shown (`showHourSeparator`, `viewStartHour`, `viewEndHour`, `scrollStartHour`, `hourHeight`, `ddIncrement`, `minEventDisplayMinutes`). This enables highly customizable calendar layouts, as shown in the new sample custom-views.html.
* New option `enableEditDetails` to hide/show the "edit details" link on the edit window
* New sample doc-types.php for easily testing various HTML doctype combinations
* Catalan and Spanish (Spain) locale files

**Bugs Fixed**

* Day/week header does not display when using many doctype combinations
* Removed store override that could break other data bound components that rely on phantom record support
* Click on week view all day header with no events present always shows first date of week in edit window
* "More events" popup window should exclude events from hidden calendars
* `CalendarList.radioCalendar` causes many unnecessary store.load calls
* Event store reloaded improperly when `view.refresh` is passed as a callback function
* String calendar ids should be allowed
* End date boundary bug in `isEventVisible`
* Revised event overlap logic for day/week views to support minimum event display height
* WeekView sometimes stays on the same week when moving forward/back using the arrow buttons
* MemoryEventStore's add event listener gets overwritten when other listeners are added by external code (applies to samples only)

## 1.0 (Beta 2)

_Dec. 30, 2010_

**New Features**

* Added CalendarView.getEventClass for customizing events at render time (works like GridView.getRowClass)
* Added Swedish, Portuguese (Portugal) and Portuguese (Brazil) locales
* Added Windows .bat build script

**Bugs Fixed**

* EventMappings not followed correctly on DayView click to show editor
* Midnight boundary display bug in DayView
* DayView/WeekView container scroll broken
* Extraneous GET request after update from edit form
* CalendarMappings not applied correctly in CalendarCombo
* Event `eventupdate` not fired correctly from views
* CalendarView.activeView undefined on initial render
* DD shims not showing on window sample (z-index issue)
* `rangeselect` event args inconsistent
* Layout bug when starting with day or week view active

## 1.0 (Beta 1)

_Dec. 9, 2010_

**API Changes**

* The default value for `CalendarView.dateParamFormat` is now 'Y-m-d' (instead of 'm-d-Y'). This was done for consistency and also because it is a more sensible default. If you are currently using the default format and handling it on your server you may need to either set this config to the old value or change the date format expected on the back end to match 'Y-m-d'.

**New Features**

* Full localization support + new sample with 4 locales
* Full remote error handling support (fully tested using the DataWriter API)
* Basic read-only calendar support
* New config to enable/disable event resizing in day/week view
* New config option to enable event editor window as modal
* New config to force a static startDay in the MultiDayView to allow for custom views

**Bugs Fixed**

* Calendar display bug for events spanning sat-sun in some cases
* Multiple GET requests on day/week view load
* Initial page load no longer executes GET with no date params
* Selected calendar date now persists consistently across page navigation
* Overlapping event display bug in day/week view for events < 30 minute duration
* Update event via DnD causes multiple duplicate PUTs
* startDay != 0 causes several boundary display bugs
* Replaced HTML char entities with XHTML-compliant codes
* Missing rounded corners on events in IE
* Null error after setting showTodayText = false

## 1.0 (Alpha 2)

_Oct. 4, 2010_

**New Features**

* Multi-calendar support
* Calendar selection sidebar widget
* CalendarListMenu component
* Remote calendar implementation example (PHP)
* New sample for showing calendar in an Ext.Window

**Bugs Fixed**

* Clicks in day header not showing edit window
* Propagate calendarStore to views correctly
* Renamed CalendarPicker -> CalendarCombo for consistency
* Various minor bug fixes and doc updates

## 1.0 (Alpha 1)

_Sept. 13, 2010_

* Original release