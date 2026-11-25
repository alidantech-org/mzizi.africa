// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'history_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

HistoryHistoryCollection _$HistoryHistoryCollectionFromJson(Map<String, dynamic> json) => HistoryHistoryCollection(
  occurrences: (json['occurrences'] as List<dynamic>).map((e) => HistoryHistoryEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$HistoryHistoryCollectionToJson(HistoryHistoryCollection instance) => <String, dynamic>{
  'occurrences': instance.occurrences,
};
