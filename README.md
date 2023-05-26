# ChordWriter

Songbooks writing software.

## What is it capable of?

This software is aimed to deliver a WYSIWYG-editor for songs with chords and songbooks.

For now using ChordWriter you can:

1. Create, edit, save, load and view songs with chords;
2. Create print-ready PDF-songbooks out of saved songs;
3. Export created songs to monotype text;
4. Import songs from monotyped text.

![Specification example](images/interface.jpg)

## How to use ChordWriter?

One of basic сoncepts of ChordWriter is a part. ChordWriter sees the song as a couple of part. A part can be a text part with or without chords or instrumental part with only chords.
For now there is no way to add tabs to the songs but it will come soon!

By pressing on button "Структура" you can activate or deactivate structure editing mode. There you can add/remove/rename parts and change their types.
When you are making a new song structure editing mode is active by default.

After adding a part you can start editing it!
Simply click on edit button to begin editing the text or add the chord.

## How to build ChordWriter?

_Prerequisites_: Node.js 18

1. Clone the repo;

2. In the root folder of the repo run
   `npm install`

3. To run debugging version run
   `npm start`
   To build binaries for your platform run
   `npm run make`
