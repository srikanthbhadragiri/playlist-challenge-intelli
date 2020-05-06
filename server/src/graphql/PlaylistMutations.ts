import { GraphQLID, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';

import ObjectFactory from '../util/ObjectFactory';
import QueryMaps from './QueryMaps';
import PlaylistObject from '../interfaces/PlaylistObject';

/**
 * This class manages the playlist mutations.
 */

class PlaylistMutations {

    private objectFactory: ObjectFactory;
    private queryMaps: QueryMaps;

    constructor(objectFactory: ObjectFactory, queryMaps: QueryMaps){
        this.objectFactory = objectFactory;
        this.queryMaps = queryMaps;
    }

    getAddPlaylist(){
        return {
            type:  this.queryMaps.ReturnMessageType,
            args: {
                title: { type: new GraphQLNonNull( GraphQLString )},
                userId: { type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parentValue, args)  => {
                const newPlaylist: PlaylistObject = {
                    ...args,
                    imageId: 1
                }
                return this.objectFactory.getPlayListsDao().insertPlaylist(newPlaylist);
            }
        }
    }
}

export default PlaylistMutations;