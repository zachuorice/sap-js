# Super Audio Player
Super Audio Player, or SAP, is a jquery plugin for adding an html5 audio player UI to any page. This player offers play/pause functionality, a bar representing the current time in the track, ability to seek in the track using this bar, support for a playlist of tracks. This is achieved through HTML, CSS, and Javascript only.

## Principles
SAP-js strives to be feature-complete, bug-free, and flexible. In addition when possible all information about tracks in the player will be specified in HTML only. Same thing for styling, all styling will be through CSS only.

## Example
See test/sap\_jquery.html for a usage example.

## Version History
### Release 1
This release is more of a prototype, styling on the player isn't very good or consistent yet, but it is somewhat functional.

Also not well-tested, so probably buggy on some browsers.

## TODO/Reminders
### v2
* More consistent and modern player style
  * Consistent width for player components [DONE]
  * True Flat-style color scheme/look [DONE]
  * Better track list look [DONE]
    * Currently doesn't really fit in with the overall look of the player
    * Would be better to have distinct boxes for each track
  * Track list details pane
    * Will appear on bottom of track list [DONE]
    * Will appear as a distinct box with a border on top separating it from the list [DONE]
    * Will support operating as an expandable box but not require or default to it
  * Intercept events from internal use of Playlist methods (e.g. this.nextTrack calling this.stop)
    * No need to let those events out, could cause bugs or inconsistent behavior
      if custom code relied on internal event trigger.
* Theme-able player style
  * Support for custom color schemes (mostly a matter of defining and employing a few key CSS color classes for components)
  * Need to figure out a few "goalpost" alternative layouts for the player that would help define where to take things regarding looks customization
  * Important to provide nice default looks and layouts while also allowing customization
* Better unit tests
* Support for annotations on tracks by timestamp
* Project website (and example, if possible)
