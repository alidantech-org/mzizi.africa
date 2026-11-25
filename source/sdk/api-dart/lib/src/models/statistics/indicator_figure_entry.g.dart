// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_figure_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsIndicatorFigureEntry _$StatisticsIndicatorFigureEntryFromJson(Map<String, dynamic> json) => StatisticsIndicatorFigureEntry(
  basis: $enumDecode(_$SharedFigureBasisEnumMap, json['basis']),
  cell: json['cell'] as String,
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  featureId: json['featureId'] as String,
  figureId: json['figureId'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  indicatorCode: json['indicatorCode'] as String?,
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

Map<String, dynamic> _$StatisticsIndicatorFigureEntryToJson(StatisticsIndicatorFigureEntry instance) => <String, dynamic>{
  'basis': _$SharedFigureBasisEnumMap[instance.basis]!,
  'cell': instance.cell,
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'featureId': instance.featureId,
  'figureId': instance.figureId,
  'fromYear': ?instance.fromYear,
  'indicatorCode': ?instance.indicatorCode,
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
