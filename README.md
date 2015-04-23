# Summit

Summit is a RESTful, real-time, error aggregator app. After installing a hook
in any application to send a `POST` to Summit with the details of an error that
has occurred, that error will show up in a real-time feed organized and filterable by stream
(or "type") of the error and the application on which it occurred.

Summit also includes a "ping" script called Scout, which periodically pings
the registered sites for a 200-level response and records their status code
health over time (graphically) in the "Sites" tab.

Summit was developed to aggregate and help developers triage errors
firing from a dozen production applications all managed by the same team.
It allowed the team to know when a user encountered an error and fix the issue
proactively.

Summit runs on an early version of Sails.js, Node ~0.10, and requires MongoDB.

![the feed](http://i.imgur.com/HU06QG9.png)