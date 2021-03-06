import {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean,
    GraphQLInt, GraphQLList
  } from 'graphql';

/**
 * This class map all GraphQLObjectTypes.
 */

import ObjectFactory from '../util/ObjectFactory';

class QueryMaps {
    public UserType;
    public PlaylistType;
    private SongType;
    private objectFactory: ObjectFactory;
    public ReturnMessageType;
    public ImageType;
    public ArtistType;
    public SongCategories;
    public CountType;
    public SearchResultType;

    constructor(objectFactory: ObjectFactory){
        this.objectFactory = objectFactory;
        this.UserType = new GraphQLObjectType({
            name: 'User',
            fields: ()=>({
                id: { type: GraphQLID },
                firstname: { type: GraphQLString },
                username: { type: GraphQLString },
                lastname: { type: GraphQLString },
                age: { type: GraphQLInt },
                gender: { type: GraphQLString },
                playlists: {
                    type: new GraphQLList(this.PlaylistType),
                    resolve: (parentValue, args) => this.objectFactory.getPlayListsDao().getPlaylistByUserId(parentValue.id)
                },
                image: {
                    type: this.ImageType,
                    resolve: (parentValue, args) => this.objectFactory.getUsersDao().getImageByUserId(parentValue.id)
                },
                likedsongs: {
                    type: new GraphQLList(this.SongType),
                    resolve: (parentValue, args) => this.objectFactory.getSongsDao().getSongsLiked(parentValue.id)
                },
                recentsongs: {
                    type: new GraphQLList(this.SongType),
                    resolve: (parentValue, args) => this.objectFactory.getSongsDao().getRecentPlayedSongs(parentValue.id)
                },
                
            })
        });
 
        this.PlaylistType = new GraphQLObjectType({
            name: 'Playlist',
            fields: ()=>({
                id: { type: GraphQLID },
                title: { type: GraphQLString },
                imageid: { type: GraphQLInt },
                userid: { type: GraphQLInt },
                songs: {
                    type: new GraphQLList(this.SongType),
                    resolve: (parentValue, args) => {    
                        return this.objectFactory.getSongsDao().getPlayListSongs( parentValue.userid, parentValue.id);
                    } 
                },
                image: {
                    type: this.ImageType,
                    resolve: (parentValue, args) => this.objectFactory.getPlayListsDao().getImageByPlaylistId(parentValue.id)
                }
            })
        })

        this.SongType = new GraphQLObjectType({
            name: 'Song',
            fields: ()=>({
                id: { type: GraphQLID },
                artistid: { type: GraphQLInt },
                imageid: { type: GraphQLInt },
                duration: { type: GraphQLString },
                source: { type: GraphQLString },
                title: { type: GraphQLString },
                genreid: { type: GraphQLInt },
                isLiked: { type: GraphQLBoolean },
                playlists: {
                    type: new GraphQLList(this.PlaylistType),
                    resolve: (parentValue, args, context, resolveInfo) => {
                        // read parent resolve arguments, user id is not passed to child queries
                        let userIdKey = 'userId';
                        if (resolveInfo.operation.selectionSet.selections[0]['name'].value === 'user' ) {
                            userIdKey = 'id';
                        }
                        let userId = resolveInfo.operation.selectionSet.selections[0]['arguments'].
                        find( a => a.name.value === userIdKey ).value.value;

                        return this.objectFactory.getPlayListsDao().getPlaylistBySongId(parentValue.id, userId)
                    } 
                },
                image: {
                    type: this.ImageType,
                    resolve: (parentValue, args) => this.objectFactory.getSongsDao().getImageBySongId(parentValue.id)
                },
                artist: {
                    type: this.ArtistType,
                    resolve: (parentValue, args) => this.objectFactory.getSongsDao().getSongArtist(parentValue.id)
                }
            })
        });

        this.ReturnMessageType = new GraphQLObjectType({
            name: 'ReturnObject',
            fields: ()=>({
                message: { type: GraphQLID },
                success: { type: GraphQLBoolean }
            })
        });

        this.ImageType = new GraphQLObjectType({
            name: 'Image',
            fields: ()=>({
                id: { type: GraphQLID },
                low: { type: GraphQLString },
                mid: { type: GraphQLString },
                high: { type: GraphQLString },
                basepath: { type: GraphQLString }
            })
        });

        this.SongCategories = new GraphQLObjectType({
            name: 'SongCategories',
            fields: ()=>({
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                image: {
                    type: this.ImageType,
                    resolve: (parentValue, args) => this.objectFactory.getSongsDao().getImageByCategoryId(parentValue.id)
                },
            })
        });

        this.ArtistType = new GraphQLObjectType({
            name: 'Artist',
            fields: ()=>({
                id: { type: GraphQLID },
                firstname: { type: GraphQLString },
                username: { type: GraphQLString },
                lastname: { type: GraphQLString },
                age: { type: GraphQLInt },
                gender: { type: GraphQLString },
                image: {
                    type: this.ImageType,
                    resolve: (parentValue, args) => this.objectFactory.getArtistsDao().getImageByArtistId(parentValue.id)
                },
                songs: {
                    type: new GraphQLList(this.SongType),
                    resolve: (parentValue, args,context, resolveInfo) => {    
                        let userId = resolveInfo.operation.selectionSet.selections[0]['arguments'].
                        find( a => a.name.value === 'userId' ).value.value;
                        return this.objectFactory.getSongsDao().getPlayListSongsByArtist(userId, parentValue.id);
                    } 
                },
            })
        });

        this.CountType = new GraphQLObjectType({
            name: 'CountType',
            fields: ()=>({
                count: { type: GraphQLInt }
            })
        });
    }
}

export default QueryMaps;
