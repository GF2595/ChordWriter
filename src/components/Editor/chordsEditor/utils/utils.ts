import { Song } from '@model/song';

export const getNewSong = (): Song => ({
    title: '',
    author: '',
    songBody: [],
});
