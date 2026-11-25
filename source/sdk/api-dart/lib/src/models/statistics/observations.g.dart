// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'observations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsObservations _$StatisticsObservationsFromJson(Map<String, dynamic> json) => StatisticsObservations(
  basis: $enumDecode(_$SharedFigureBasisEnumMap, json['basis']),
  cell: json['cell'] as String,
  collectionId: json['collectionId'] as String?,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  featureId: json['featureId'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  indicatorId: json['indicatorId'] as String,
  lower: (json['lower'] as num?)?.toDouble(),
  revision: (json['revision'] as num).toInt(),
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  status: $enumDecode(_$SharedFigureStatusEnumMap, json['status']),
  subjectId: json['subjectId'] as String?,
  supersedesId: json['supersedesId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  upper: (json['upper'] as num?)?.toDouble(),
  value: (json['value'] as num?)?.toDouble(),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$StatisticsObservationsToJson(StatisticsObservations instance) => <String, dynamic>{
  'basis': _$SharedFigureBasisEnumMap[instance.basis]!,
  'cell': instance.cell,
  'collectionId': ?instance.collectionId,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'featureId': instance.featureId,
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'indicatorId': instance.indicatorId,
  'lower': ?instance.lower,
  'revision': instance.revision,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'status': _$SharedFigureStatusEnumMap[instance.status]!,
  'subjectId': ?instance.subjectId,
  'supersedesId': ?instance.supersedesId,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'upper': ?instance.upper,
  'value': ?instance.value,
  'version': instance.version,
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
