// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'era_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

HistoryEraEntry _$HistoryEraEntryFromJson(Map<String, dynamic> json) => HistoryEraEntry(
  code: json['code'] as String,
  eraId: json['eraId'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => HistoryEraEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  parentId: json['parentId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$HistoryEraEntryToJson(HistoryEraEntry instance) => <String, dynamic>{
  'code': instance.code,
  'eraId': instance.eraId,
  'fromYear': ?instance.fromYear,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'parentId': ?instance.parentId,
  'toYear': ?instance.toYear,
};
