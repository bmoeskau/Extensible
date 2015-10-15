# All About Recurrence!

Recurrence is not easy to deal with in applications, and it is particularly tricky to offer as a feature of a general-purpose component. There are many different ways to implement it (with server integration being integral), and Calendar Pro's primary goal is to remain as flexible as possible. Thus I thought it would be worthwhile to provide an overview of some of the design decisions that went into the Extensible recurrence implementation and outline some strategies for integrating it into applications. Also, there simply aren't very many good resources available for tackling how to implement recurrence in general, so hopefully this will be a good resource for developers hoping to do so.

## Conceptual Design


To implement recurrence in an application, you need to consider all of the following:

- **Application Goals** &mdash; Define what "recurrence" really means to your application and what level of complexity your users require (hint: simpler is almost always better)
- **Recurrence Format** &mdash; Choose a recurrence format and supporting data to store with your events that makes it easy (or at least *possible*) to query against events with
- **Event Generation** &mdash; Parse the recurrence data format when retrieving events to generate recurring instances dynamically
- **Event Exceptions** &mdash; Handle exceptions to a recurrence pattern, such as a single deleted instance in the pattern
- **User Experience** &mdash; Provide a mechanism in the UI for associating a recurrence pattern to an event and editing it later

This is a pretty nontrivial list, so let's break it down piece by piece.

## Application Goals

It's important to decide up front what level of recurrence is required for your application. The Extensible recurrence widget takes a middle-ground approach out of the box, offering the most common calendar scheduling options of daily, weekly, monthly and yearly recurrence, with basic options for setting the repeat frequency and duration.

If your application does not require all of those options, it might make sense to customize or replace the default Extensible widget. For example, if your application can offer simpler options without the need to set frequency or duration, a simple combo box might meet your needs better.

Some applications may require more complexity than Extensible offers for managing recurring events. For example, some applications allow users to define *exclusion* recurrence patterns, that remove certain dates from an existing recurring event set. Use cases like this would have to be custom built.

## Recurrence Format

While you are certainly free to invent your own custom format for storing recurrence, it is **highly recommended** that you use the standard [RRULE format](http://www.kanzaki.com/docs/ical/rrule.html) as specified in the [RFC-2445 iCalendar specification](http://www.ietf.org/rfc/rfc2445.txt) (Calendar Pro uses this). However, under the umbrella of "recurrence" there are actually many different related properties in the spec:

- [DTSTART](http://www.kanzaki.com/docs/ical/dtstart.html) / [DTEND](http://www.kanzaki.com/docs/ical/dtend.html): The event start and end dates
- [DURATION](http://www.kanzaki.com/docs/ical/duration-t.html): The length of time of the event
- [RRULE](http://www.kanzaki.com/docs/ical/rrule.html): The basic rule for defining a recurrence pattern (which is of type [RECUR](http://www.kanzaki.com/docs/ical/recur.html))
- [RDATE](http://www.kanzaki.com/docs/ical/rdate.html): A list of discreet date/time values that can be aggregated with the RRULE to produce a union of event instances
- [EXRULE](http://www.kanzaki.com/docs/ical/exrule.html) / [EXDATE](http://www.kanzaki.com/docs/ical/exdate.html): Same as the "R" versions, except for exceptions to the recurrence pattern that are excluded when calculating the final set of discreet event instances
- [VTIMEZONE](http://www.kanzaki.com/docs/ical/vtimezone.html): A list of rules for Daylight Savings observance by timezone

Perusing these specs even for a few minutes might make your head spin. And these documents simply *define* the data formats &mdash; we haven't even begun implementing anything yet! In reality, the complexity is dependent on the requirements of your intended usage (e.g. for custom exclusion ranges as mentioned in the previous section you would explore the EXRULE format). Luckily most people can get by with only a subset of what the specs define.

Another thing to keep in mind is that one of the primary goals of the RFC is to define specifications for *interoperability* between calendaring systems, which necessarily increases complexity. In most cases (and certainly in all cases supported directly by Calendar Pro) we won't be sending iCal-formatted data packets from one system to another &mdash; you will simply be persisting and retrieving event data to and from your own servers. In the event that you need to interact with a third-party API, you would be more concerned with that API's specific implementation than with the RFC. As such, unless you are actually authoring a public calendaring API (and if you are, I wish you luck :) much of the complexity in the specs can be safely ignored.  Let's walk through the details of how Calendar Pro addresses implementation.

### Rule 0

Before we get started, let's get this out of the way right up front:

> **Do NOT store individual recurring event instances as rows in your database!**

You might wonder if anyone would really do this, but I've seen many commenters on Stack Overflow (and used at least one production application) that stored recurring event instances as separate DB rows. After all, at first glance, it seems like a common sense approach that actually does solve some of the complexity we'll discuss later (e.g. how to query for recurring events). Could it really be that bad?

*Storing recurring events as individual rows is a recipe for disaster.*

Imagine a typical recurring event like "Repeat every weekday for 10 weeks". Simple right? Translated into event *instances*, that single rule represents **50 unique events**. Throw a few of those into a single multi-week view, and you'll likely run into rendering performance issues pretty quickly.

Now imagine another common recurrence pattern: "Repeat every Monday". Another very simple, and quite common rule. Note the absence of an end date &mdash; how many unique event instances will that rule generate? That depends on the system on which the code is running, but simply put you could potentially generate an event for every Monday between now and the system's maximum date (December 31, 9999 anyone?).

The best case scenario is that you must arbitrarily limit the recurrence range or instance count your users can select (e.g. "up to 10 instances") in which case you've severely crippled the usability of your application and made an already-complex process even more complicated to manage.

The worst case scenario is that you don't limit the possible range of recurrence, and a single event that recurs daily with no end date instantly exhausts your database's storage capacity or your application's RAM (whichever comes first) and your server crashes. I've seen this happen!

So, just to be clear:

> Always store a recurrence *pattern*, never store recurrence *instances*. **Instances should be calculated at runtime.**

### Event Schema

To define a calendar event, technically all that is required is a start and end date/time. Other common fields are title, unique id and, if supported, an "all day" flag. Aside from that, other data is purely application-driven. In order to support recurrence, a few additions to the default schema are required.

	Event                 Exception
	=================     ===============
	EventID               EventID (FK)
	Title                 ExceptionDateUtc
	StartDateUtc
	EndDateUtc
	IsAllDay
	Duration
	IsRecurring
	RecurrencePattern
	(other stuff...)

As you can see in this simplified entity relationship diagram, we've added a few extra event columns, and (optionally) a related table for tracking recurrence exceptions. This is not the only possible way to design your schema, but it's a decent choice. Here are some thoughts that went into it:

- RecurrencePattern is of course the iCal recurrence string, assuming that the iCal RFC is being followed (e.g., `FREQ=DAILY;INTERVAL=10;COUNT=5`). If some custom recurrence pattern scheme is in use then this might be different.
- Duration is strongly recommended in conjunction with recurrence, as explained in the next section
- A separate flag for "IsRecurring" is not strictly required, but may be handy to avoid having to check `NOT NULL` or compare to empty string if querying only against the pattern field. Depending on your database, there could be performance implications with doing this also. You could also create a derived field for this in your data model without needing an extra column, if that makes sense for you (or just check the pattern for `NULL` if you really want to, see if I care :)
- For exceptions, there are actually lots of different ways to approach storing them. Another simple option might be avoiding the separate table and storing a delimited string of exception dates as another column in the event table, although the table approach leaves open more flexibility for enhancing exception support in the future. We'll talk through this in much more detail below in the section specifically dealing with exceptions.

While Calendar Pro certainly does not mandate how you should design your database, this is a good starting point if you're unsure how to approach it. This will also be the assumed schema for the purposes of further talking through implementation details, so if you choose to store your data differently you may have to adjust some of the details appropriately.

*A Note on UTC*

You may have noticed the suffix *Utc* on the date/time columns in the above schema. It's not strictly required, but is good practice to store dates in UTC ([Coordinated Universal Time](http://en.wikipedia.org/wiki/Coordinated_Universal_Time)) format, and it's critical to do so in any sort of distributed system. There are multiple points in the processing of date-based data that require date/time arithmetic and/or comparison. If you are comparing a user-local date/time value to an environment-specific date variable (e.g., something like Date.now() which is quite common) in server code, the answer will only be correct if both user and server are in the same timezone. This would force you to track timezone separately, and include it in all date/time operations, excessively complicating your code. Even then, you would still be inviting obscure bugs around daylight savings boundary dates since user-local timezones may observe DST quite differently (or not at all).

The best practice is to convert all user-local date/time values to UTC for storage and processing, and only convert back to user-local time at the point of displaying back to the user. All operations and comparisons on the data should be done in UTC (meaning for example that date/time query parameters would also be converted to UTC when querying), which is guaranteed to be consistent and does not change in relation to locality or time of year (unlike local time). This does mean of course that you would have to store the user's timezone, and use it in the conversion between local and UTC time, but you would not have to send it along as part of the transactional event data (typically it would be retrieved once and stored in the user's session for server-side processing).

### Event Frequency

The spec outlines support for recurrence frequency as small as `SECONDLY`. However for practical reasons, Calendar Pro's minimum frequency will be daily. Most typical calendar implementations do the same (see Google Calendar, for example), and given the layout constraints of the current calendar implementation, supporting frequencies smaller than daily would require a more granular view than what's currently available. If you need hourly or minutely recurrence (surely no one needs secondly...) you'll have to create multiple events starting at each desired interval.

### Event Exceptions

According to the spec, support for exceptions is just as flexible as support for events. The spec supports creating full blown exception ranges and patterns, in addition to individual exception instances. In practice, such support adds undue complexity to the user interface and is rarely implemented. Most commonly exceptions are supported only as one-off instances, and that's the assumption that Extensible will make as well. This will be discussed in more detail in the section below on event editing.

### Storage and Retrieval

**NOTE**: Some platforms already provide a native event / recurrence API, with storage and retrieval abstracted for you. Microsoft, for example, offers such an API via [Exchange Web Services](http://msdn.microsoft.com/en-us/library/dd633694%28v=exchg.80%29.aspx) for integrating with an Exchange-based calendar system. The following section assumes that you do NOT have such an API handy and that you need to design your own solution for storing and retrieving recurring events.

According to the spec, "the DTSTART and DTEND property pair or DTSTART and DURATION property pair...defines the first instance of the recurrence." However, this choice only makes sense in terms of the interoperability use case of sending an event between systems. In that case, the two options are equivalent in terms of parseability.

When implementing recurrence for storage and retrieval, my recommendation is:

- Always store the start date and event duration
- For recurrence patterns that include an end date explicitly (via UNTIL), store it as the end date
- For recurrence patterns that specify the number of instances (via COUNT), calculate the end date and store that
- For recurrence patterns with no end date or count, store the end date as a distant future date, such as the database's "max date" property (e.g., '9999-12-31')
- Always store a non-null end date, even for events with no duration (store the same date/time for both in that case)

The primary reason for these choices is for querying against the data. Think about constructing a calendar view &mdash; your query will look something like "return all events between January 1 and January 31 of 2012". Now assume that you have a one hour event that repeats every day at 09:00 for a year.  Simply in terms of recurrence, you could define the event like this:

| Start Date           | End Date             | Recurrence Pattern     |
|----------------------|----------------------|------------------------|
| Jan 1, 2012 at 09:00 | Jan 1, 2012 at 10:00 | Recur daily for 1 year |

As you can see, that's perfectly sufficient for describing the event accurately. The problem is that the start and end dates are only for the first occurrence, so what happens when the view requests "all events between February 1 and February 29 of 2012"? January 1 is not in that range, so in order to know *at query time* if that event matches, you would have to parse the recurrence pattern, *during the query*, for every recurring event in the database. The other option would be to always return *every single recurring event* in the database with a start date prior to the query date range, then process each one in code. Yikes.

While you can't avoid parsing recurrence rules at *some* point in the process, the goal is to filter out as many events as possible during the query, and without adding undue query overhead. The basic rule is:

> You always want both start and end dates to contain valid date/time values, and the start/end combination should always reflect the entire possible range of dates that could match a given query.

This means that if an event has recurrence, the stored end date will always be the end date for the recurrence pattern, even when no date is specified, which is why we need a separate duration field that tells us how long each event instance should be. Note that you could alternately add a recurrence-specific end date instead of duration, or even store additional columns calculated from the recurrence pattern if needed. Again, there are many possible ways to solve it, but the takeaway is that you must be able to distinguish between the pattern end date and the end date of each instance to enable practical querying.

To return to our example above, according to our example schema we would store the event like so:

| Start Date           | End Date             | Duration | Recurrence Pattern     |
|----------------------|----------------------|----------|------------------------|
| Jan 1, 2012 at 09:00 | Jan 1, 2013 at 10:00 | 1 hour   | Recur daily for 1 year |

With this data, you can now query as expected for any events beginning or ending between (or spanning) the stored start and end dates. More importantly, for a query like "return all events for June 2015" the query will immediately exclude the specified event, with no processing necessary. Contrast to the original approach above, in which case this event would still have to be returned and processed (or the query would have extra work to do) before we could determine that it is not a match.

Note that for any particular date during 2012, you still can't know for certain if it is a matching instance without ultimately processing the pattern, but the key is to be able to exclude all events that fall outside of the range at query time.

## Event Generation


## Event Exceptions


## User Experience

### Recurrence Editing

Recurrence editing can get a little tricky as there are several different editing scenarios that must be handled. Luckily these will be mostly baked into the recurrence support already so the end developer shouldn't have too much to do, but I want to make sure that the different scenarios are clearly outlined:

**Update or Delete All Instances**

**Update or Delete Only the Selected Instance**

**Update or Delete Future Instances**


Option A is actually the simplest one since editing all instances means simply updating the start date, duration and/or recurrence pattern of the existing event, and that's it.

Option C is not too bad either, as you can simply split the event into two distinct events, each with its own recurrence data. The original event is updated with a new end date and/or recurrence pattern, and the new event is a complete copy of the original (new DB row) with different event id and a different start date + recurrence pattern.

Option B is the trickiest since you have to manage exceptions as a completely separate bit of metadata.  I've seen this done either via a dedicated lookup table where each row is an exception date with a foreign key to its event, or as a column in the event table where each date is delimited into a string value. For my purposes the storage strategy doesn't matter, but the developer will obviously have to return exceptions somehow so there will need to be a standardized approach to doing so and reading them properly in the client-side code.



---
---

When querying for events, we then always had a filter step after the query to check for events with the recurring flag, and parse the recurrence pattern for each one to generate any instances that might also fit the query range.  Any matches were created as new Event objects and added to the query results returned from the server.
We used an iCal parsing library for this logic, which was key &mdash; most people don't have the time to figure out the iCal spec (and there's a lot to it)

So that's one approach, and it assumes that everything on the back end is manually implemented.  It has several drawbacks:
Requires each end developer to reinvent the same wheel, and it's non-trivial to say the least
Assumes availability of an iCal parser, which may or may not exist per platform
Means that out of the box, there would effectively be no real working recurrence implementation, only a control and client-side support

The calendar would not be able to generate/render recurring events properly when disconnected from the server
A better option for some people is to be able to use a back end service that natively handles the iCal recurrence format for you, the best example being Exchange Server.  I haven't implemented it myself, but I understand that it basically provides an API that supports passing an iCal string, and Exchange handles all the heavy lifting I described above for you.  Of course, I can't assume that everyone will have something like that (most people won't) but at least having that simple option is useful.

# Other References

Here are a few additional references for dealing with recurrence that you might find helpful.

- http://svn.osafoundation.org/docs/trunk/docs/specs/rel0_6/Reccurence-0.6.html
- http://chandlerproject.org/Journal/AllYourRecurrenceRulesAreBelongToUs
- http://www.daypilot.org/calendar-tutorial-recurrent-events.html
- http://dotnetslackers.com/articles/aspnet/Understanding-Teleriks-Scheduler-Recurrence.aspx
