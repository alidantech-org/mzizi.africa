// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'observation_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsObservationEntry _$StatisticsObservationEntryFromJson(Map<String, dynamic> json) => StatisticsObservationEntry(
  basis: $enumDecode(_$SharedFigureBasisEnumMap, json['basis']),
  breakdowns: (json['breakdowns'] as List<dynamic>)
      .map((e) => StatisticsObservationEntryBreakdowns.fromJson(e as Map<String, dynamic>))
      .toList(),
  cell: json['cell'] as String,
  collectionId: json['collectionId'] as String?,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  lower: (json['lower'] as num?)?.toDouble(),
  observationId: json['observationId'] as String,
  revision: (json['revision'] as num).toInt(),
  status: $enumDecode(_$SharedFigureStatusEnumMap, json['status']),
  supersedesId: json['supersedesId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  upper: (json['upper'] as num?)?.toDouble(),
  value: (json['value'] as num?)?.toDouble(),
);

Map<String, dynamic> _$StatisticsObservationEntryToJson(StatisticsObservationEntry instance) => <String, dynamic>{
  'basis': _$SharedFigureBasisEnumMap[instance.basis]!,
  'breakdowns': instance.breakdowns,
  'cell': instance.cell,
  'collectionId': ?instance.collectionId,
  'fromYear': ?instance.fromYear,
  'lower': ?instance.lower,
  'observationId': instance.observationId,
  'revision': instance.revision,
  'status': _$SharedFigureStatusEnumMap[instance.status]!,
  'supersedesId': ?instance.supersedesId,
  'toYear': ?instance.toYear,
  'upper': ?instance.upper,
  'value': ?instance.value,
};

const _$SharedFigureBasisEnumMap = {
  SharedFigureBasis.aggregated: 'aggregated',
  SharedFigureBasis.estimated: 'estimated',
  SharedFigureBasis.measured: 'measured',
  SharedFigureBasis.modelled: 'modelled',
  SharedFigureBasis.projected: 'projected',
};

const _$SharedFigureStatusEnumMap = {
  SharedFigureStatus.estimated: 'estimated',
  SharedFigureStatus.finalValue: 'final',
  SharedFigureStatus.missing: 'missing',
  SharedFigureStatus.projected: 'projected',
  SharedFigureStatus.provisional: 'provisional',
  SharedFigureStatus.revised: 'revised',
  SharedFigureStatus.suppressed: 'suppressed',
};
