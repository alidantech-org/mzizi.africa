// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'occurrence_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventOccurrenceCollection _$EventOccurrenceCollectionFromJson(Map<String, dynamic> json) => EventOccurrenceCollection(
  occurrences: (json['occurrences'] as List<dynamic>).map((e) => EventOccurrenceEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$EventOccurrenceCollectionToJson(EventOccurrenceCollection instance) => <String, dynamic>{
  'occurrences': instance.occurrences,
};
