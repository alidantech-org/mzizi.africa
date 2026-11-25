// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'history_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

HistoryHistoryEntry _$HistoryHistoryEntryFromJson(Map<String, dynamic> json) => HistoryHistoryEntry(
  code: json['code'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => HistoryHistoryEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  occurrenceId: json['occurrenceId'] as String,
  precision: $enumDecode(_$SharedDatePrecisionEnumMap, json['precision']),
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$HistoryHistoryEntryToJson(HistoryHistoryEntry instance) => <String, dynamic>{
  'code': instance.code,
  'fromYear': ?instance.fromYear,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'occurrenceId': instance.occurrenceId,
  'precision': _$SharedDatePrecisionEnumMap[instance.precision]!,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'toYear': ?instance.toYear,
};

const _$SharedDatePrecisionEnumMap = {
  SharedDatePrecision.circa: 'circa',
  SharedDatePrecision.day: 'day',
  SharedDatePrecision.decade: 'decade',
  SharedDatePrecision.month: 'month',
  SharedDatePrecision.year: 'year',
};
