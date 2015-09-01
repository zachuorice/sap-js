# SuperAudioPlayer Design Document
Super Audio Player, SAP, is a set of components for creating interactive, custom HTML5 audio players.

## Components
### SAP Playlist (Backend)
Allows grouping of audio tags into a playlist. Keeps track of play/pause, current seek position, audio length, pretty much the core component of SAP.

### SAP Player (Frontend)
This component allows you to manage the playback of an audio object. This includes play/pause, next, previous, seek forward, and seek back controls. This is backed by the SAP Playlist component.

### SAP Scrubber (Frontend)
This component allows changing your position in a track by clicking on a timeline. This is backed by the SAP Playlist component.

### SAP Track List (Frontend)
This component displays a list of tracks which are linked to a SAP Playlist. Each track can also have an associated expandable frame which will contain additional info about the track.

## Design Notes
### MVC Refactor
A refactor that splits up the code into a model/controller and view setup would work well. The controller code would handle actions and passing data to and from the view, while the view would be responsible for responding to user input with the appropriate actions.

This would allow for entirely custom players, rather than the fairly inflexible UI component architecture that we have at the moment.
