# SuperAudioPlayer Design Document
Super Audio Player, SAP, is a set of components for creating interactive, custom HTML5 audio players.

## Components
### SAP Playlist (Backend)
Allows grouping of audio tags into a playlist. Keeps track of play/pause, current seek position, audio length, pretty much the core component of SAP.

### SAP Player (Frontend)
This component allows you to manage the playback of an audio object. This includes play/pause, next, previous, seek forward, and seek back controls. This is backed by the SAP Playlist component.

### SAP Timeline (Frontend)
This component allows changing your position in a track by clicking on a timeline. This is backed by the SAP Playlist component.

### SAP Track List (Frontend)
This component displays a list of tracks which are linked to a SAP Playlist. Each track can also have an associated expandable frame which will contain additional info about the track.

### Notes
These components don't preclude allowing semantic HTML specification of a player, this is the code that will back a semantic HTML-based plugin. I might be a bit confused about what semantic HTML entails as well, I think it really just means keeping style and data separate. However it's always a plus if I can specify HTML that conveys all the information needed.

I'd like to first write the code (using skeleton versions of the above components), that will take semantic HTML and translate it to the player backend, and replacing (hiding) the original HTML and replacing it with a complete player. The original HTML should convey all the information (NO FANCY LAYOUTS THOUGH) and nothing more. Write a test suite for the expected backend components to be produced from any given input.