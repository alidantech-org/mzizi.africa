// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'results.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionResults _$ElectionResultsFromJson(Map<String, dynamic> json) => ElectionResults(
  basis: $enumDecode(_$SharedFigureBasisEnumMap, json['basis']),
  candidateId: json['candidateId'] as String?,
  choiceId: json['choiceId'] as String?,
  collectionId: json['collectionId'] as String?,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String,
  formId: json['formId'] as String?,
  id: json['id'] as String,
  revision: (json['revision'] as num).toInt(),
  status: $enumDecode(_$SharedFigureStatusEnumMap, json['status']),
  supersedesId: json['supersedesId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  votes: (json['votes'] as num?)?.toInt(),
);

Map<String, dynamic> _$ElectionResultsToJson(ElectionResults instance) => <String, dynamic>{
  'basis': _$SharedFigureBasisEnumMap[instance.basis]!,
  'candidateId': ?instance.candidateId,
  'choiceId': ?instance.choiceId,
  'collectionId': ?instance.collectionId,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': instance.featureId,
  'formId': ?instance.formId,
  'id': instance.id,
  'revision': instance.revision,
  'status': _$SharedFigureStatusEnumMap[instance.status]!,
  'supersedesId': ?instance.supersedesId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'votes': ?instance.votes,
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
