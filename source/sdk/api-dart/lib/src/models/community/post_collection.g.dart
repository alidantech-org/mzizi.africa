// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'post_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityPostCollection _$CommunityPostCollectionFromJson(Map<String, dynamic> json) =>
    CommunityPostCollection(posts: (json['posts'] as List<dynamic>).map((e) => CommunityPostEntry.fromJson(e as Map<String, dynamic>)).toList());

Map<String, dynamic> _$CommunityPostCollectionToJson(CommunityPostCollection instance) => <String, dynamic>{'posts': instance.posts};
