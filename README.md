# Super Audio Player
Super Audio Player, or SAP, is a jquery plugin for adding an html5 audio player UI to any page. This player offers play/pause functionality, a bar representing the current time in the track, ability to seek in the track using this bar, support for a playlist of tracks. This is achieved through HTML, CSS, and Javascript only.

## Principles
SAP-js strives to be feature-complete, bug-free, and flexible. In addition when possible all information about tracks in the player will be specified in HTML only. Same thing for styling, all styling will be through CSS only.

## Dependencies
The only dependencies for sap-js are jquery and font-awesome.

## Example
See test/sap\_jquery.html for a usage example.

## Version History
### Release 1.0.0
This release is more of a prototype, styling on the player isn't very good or consistent yet, but it is somewhat functional.

Also not well-tested, so probably buggy on some browsers.

### Release 1.1.0
Improved styling, layout, and behaviour along with some small bug fixes.

### Releas 2.0.0
Project website done.

## TODO/Reminders
### v2
* More consistent and modern player style [DONE]
  * Consistent width for player components [DONE]
  * True Flat-style color scheme/look [DONE]
  * Better track list look [DONE]
    * Currently doesn't really fit in with the overall look of the player
    * Would be better to have distinct boxes for each track
  * Track list details pane [DONE]
    * Will appear on bottom of track list [DONE]
    * Will appear as a distinct box with a border on top separating it from the list [DONE]
* Project website (and example, if possible) [DONE]

### v3
* Support for annotations on tracks by timestamp
