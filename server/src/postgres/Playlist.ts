import debugLib from 'debug';

const debug = debugLib('Playlist');

import { tableNames } from '../constants/dbConstants';
import PlaylistObject from '../interfaces/PlaylistObject';

class Playlist {
    private db;
    constructor(db) {
        this.db = db;
    }

    public insertPlaylist(playlistObject: PlaylistObject) {
        const query = `INSERT INTO ${tableNames.PLAYLIST} (title, userId, imageId, createDate, modifiedDate)
        VALUES ( '${playlistObject.title}', '${playlistObject.userId}', ${playlistObject.imageId}, now(), now())`;
        return this.db.any(query).then( data => {
            return {
                message: 'Playlist added successfully',
                success: true
            }
        }).catch(err=>{
            debug('Eror in insert playlist', err.message);
        });
    }

    public getPlaylistByUserId(id:number) {
        const query = `SELECT * FROM ${tableNames.PLAYLIST} WHERE userid = ${ id }`;
        return this.db.many(query);
    }
    public getPlaylistByPlaylistid(id:number) {
        const query = `SELECT * FROM ${tableNames.PLAYLIST} WHERE id = ${id}`;
        return this.db.one(query);
    }

    public insertSongToPlaylist(playListId:number, songId:number) {
        const query = `INSERT INTO ${tableNames.PLAYLIST_SONGS} ( songId, playlistId, createDate) VALUES ('${songId}', '${playListId}','now()')`;
        return this.db.one(query);
    }
    public getImageByPlaylistId(id: number) {
        const query = `SELECT * FROM ${tableNames.IMAGES} where id in ( select imageid from ${tableNames.PLAYLIST} WHERE id = ${id} )`;
        return this.db.one(query);
    }

    public searchPlaylists(userId: number, input: string) {
        const query = `SELECT * FROM ${tableNames.PLAYLIST} where title like '%${input}%' and userId = ${userId}`;
        return this.db.any(query);
    }

    public getPlaylistBySongId(songId: number, userId: number) {
        const query = `SELECT * FROM ${tableNames.PLAYLIST} WHERE 
        id in ( select playlistId from ${tableNames.PLAYLIST_SONGS} where songid = ${songId}) and userId = ${userId}`;
        return this.db.any(query);
    }
}

export default Playlist;
