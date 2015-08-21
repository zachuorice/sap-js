# Super Audio Player
## Introduction
Super Audio Player, or SAP, is a jquery plugin for adding a really nice html5 audio player to any page. This player offers play/pause functionality, a bar representing the current time in the track, ability to seek in the track using this bar, expandable dropdown menu on player for adding information about the track (in the HTML), support for track annotations, and support for a playlist of tracks. This is achieved through HTML, CSS, and Javascript only.

## Principles
SAP-js strives to be feature-complete, bug-free, and flexible. In addition when possible all information about tracks in the player will be specified in HTML only. Same thing for styling, all styling will be through CSS only.

Ideally the plugin will take HTML like this:
	<section id="sap-plugin-target">
		<header>Album Title</header>
		<div class="sap-global-tab" data-title="Album Bio">
			All sorts of narcissist fun!
		</div>
		<ol>
			<li>
				<dl class="sap-annotations">
					<dt>1:15</dt>
					<dd>This is the first annotation, and occurs at 1:15.</dd>
					<dt>3:00</dt>
					<dd>That was a terrible track, thanks for listening!</dd>
				</dl>
				<audio data-title="Cool First Track!" src="foo.ogg"></audio>
				<div class="sap-tab" data-title="Track Bio">
					About the track!
				</div>
			</li>
			<li>
				<audio data-title="Cool Second Track!" src="foo2.ogg"></audio>
				<div class="sap-tab" data-title="Track Bio">
					About the track!
				</div>
			</li>
		</ol>
	</section>

This HTML will be used as data for the audio player, ideally if Javascript is not available the audio tags would still work and this HTML block would be rendered. However that would require specifying the controls attribute on the audio tags for proper operation.

## TODO/Reminders
This is mostly for todos related to the project organization, and things in the future that I want to remember to do.

* Rewrite this README once this is releasable. At the moment this is kind of a living-document for ideas, notes, etc.