// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionElectionCollection _$ElectionElectionCollectionFromJson(Map<String, dynamic> json) => ElectionElectionCollection(
  elections: (json['elections'] as List<dynamic>).map((e) => ElectionElectionEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ElectionElectionCollectionToJson(ElectionElectionCollection instance) => <String, dynamic>{
  'elections': instance.elections,
};
