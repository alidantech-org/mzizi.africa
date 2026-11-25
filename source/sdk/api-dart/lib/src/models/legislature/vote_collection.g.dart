// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'vote_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureVoteCollection _$LegislatureVoteCollectionFromJson(Map<String, dynamic> json) => LegislatureVoteCollection(
  votes: (json['votes'] as List<dynamic>).map((e) => LegislatureVoteEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$LegislatureVoteCollectionToJson(LegislatureVoteCollection instance) => <String, dynamic>{'votes': instance.votes};
