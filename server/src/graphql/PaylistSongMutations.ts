import { GraphQLID, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';

import ObjectFactory from '../util/ObjectFactory';
import QueryMaps from './QueryMaps';
import PlaylistSongsObject from '../interfaces/PlaylistSongsObject';

/**
 * This class manages the paylistsong mutations.
 */

class PaylistSongMutations {

    private objectFactory: ObjectFactory;
    private queryMaps: QueryMaps;

    constructor(objectFactory: ObjectFactory, queryMaps: QueryMaps){
        this.objectFactory = objectFactory;
        this.queryMaps = queryMaps;
    }

    getAddSongToPlaylist(){
        return {
            type:  this.queryMaps.ReturnMessageType,
            args: {
                songId: { type: new GraphQLNonNull( GraphQLString )},
                playlistId: { type: new GraphQLNonNull( GraphQLString )}
            },
            resolve: (parentValue, args)  => {
                const newPlaylistSongs = [];
                const songIds = args.songId.split(',');
                const playlistIds = args.playlistId.split(',');
                for(let i=0; i<songIds.length; i++){
                    for(let j=0; j<playlistIds.length; j++){
                        const songId = parseInt(songIds[i], 10);
                        const playlistId = parseInt(playlistIds[j], 10);
                        const newPlaylistSong: PlaylistSongsObject = {
                            songId,
                            playlistId
                        }
                        newPlaylistSongs.push(newPlaylistSong);
                    }
                }
                return this.objectFactory.getPlaylistSongsDao().insertPlaylistSongs(newPlaylistSongs);
            }
        }
    }

    getDeleteSongFromPlaylist(){
        return {
            type: this.queryMaps.ReturnMessageType,
            args: {
                songId: { type: new GraphQLNonNull( GraphQLString )},
                playlistId: { type: new GraphQLNonNull( GraphQLString )}
            },
            resolve: (parentValue, args) => this.objectFactory.getPlaylistSongsDao().deletePlaylistSong(args.songId, args.playlistId)
        }
    }
}

export default PaylistSongMutations;