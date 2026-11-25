// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tally_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionTallyCollection _$ElectionTallyCollectionFromJson(Map<String, dynamic> json) => ElectionTallyCollection(
  tallies: (json['tallies'] as List<dynamic>).map((e) => ElectionTallyEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ElectionTallyCollectionToJson(ElectionTallyCollection instance) => <String, dynamic>{'tallies': instance.tallies};
