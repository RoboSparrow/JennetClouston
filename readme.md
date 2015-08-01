Jennet Clouston Curse Generator
===============================

**Hoot, hoot! Jenny Clouston at ye service.**

*UPDATE:*  The Google Translate API is now only available as a paid service, so the current solution wont work anymore. Darn!
I am planning to use the [Text to Speech Api](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html) instead. 

About
-----

Jennet Clouston is a marginal character from Robert Lois Stevenson's novel ["Kidnapped"](http://en.wikipedia.org/wiki/Kidnapped_%28novel%29).
The main character David Balfour encounters the *stout, dark, sour-looking woman* on his way to the House of Shaws in Southern Scotland, the castle of his anchestors.

Asked for the way to the mansion, Jennet casts **one of the best curses in literature** on the House of Shaws and it's current landlord, Ebenezer Balfour.

### The Curse:

> "That is the house of **Shaws**!" she cried. "Blood built it; blood stopped the building of it; blood shall bring it down. See here!" she cried again -- "I spit upon the ground, and crack my thumb at it! Black be its fall! If ye see **the laird**, tell him what ye hear; tell him this makes the twelve hunner and nineteen time that Jennet Clouston has called down the curse on him and his house, byre and stable, man, guest, and master, wife, miss, or bairn -- black, black be their fall!"

Taken from: [About.com - Classic Literature](http://classiclit.about.com/library/bl-etexts/rlstevenson/bl-rlst-kid-2.htm)

HowTo
-----

Browse to `curse.html` and enter your foes's **name** and **house**. (If you don't enter anything the defaults from the novel will be used.)

Techs
----

The little app uses the [Google  Translate public API](https://translate.google.com/) to give Jenny a voice. Unfortunately the API is not CORS enabled (and likely never will be), so a small server script is required for fetching and building the mp3 .

* requires PHP
* Browser compatibility: ES5, lte IE 9

License
=======

Non-third party files are licensed under the [WTFPL](http://www.wtfpl.net/about/).
