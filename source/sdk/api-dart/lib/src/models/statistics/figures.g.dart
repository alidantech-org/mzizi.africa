// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'figures.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsFigures _$StatisticsFiguresFromJson(Map<String, dynamic> json) => StatisticsFigures(
  basis: $enumDecode(_$SharedFigureBasisEnumMap, json['basis']),
  cell: json['cell'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  featureId: json['featureId'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  indicatorId: json['indicatorId'] as String?,
  lower: (json['lower'] as num?)?.toDouble(),
  metricId: json['metricId'] as String?,
  observationId: json['observationId'] as String?,
  refreshedAt: DateTime.parse(json['refreshedAt'] as String),
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  status: $enumDecode(_$SharedFigureStatusEnumMap, json['status']),
  subjectId: json['subjectId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  upper: (json['upper'] as num?)?.toDouble(),
  value: (json['value'] as num?)?.toDouble(),
);

Map<String, dynamic> _$StatisticsFiguresToJson(StatisticsFigures instance) => <String, dynamic>{
  'basis': _$SharedFigureBasisEnumMap[instance.basis]!,
  'cell': instance.cell,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'featureId': instance.featureId,
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'indicatorId': ?instance.indicatorId,
  'lower': ?instance.lower,
  'metricId': ?instance.metricId,
  'observationId': ?instance.observationId,
  'refreshedAt': instance.refreshedAt.toIso8601String(),
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'status': _$SharedFigureStatusEnumMap[instance.status]!,
  'subjectId': ?instance.subjectId,
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
