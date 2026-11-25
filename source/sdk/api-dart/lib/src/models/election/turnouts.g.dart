// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'turnouts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionTurnouts _$ElectionTurnoutsFromJson(Map<String, dynamic> json) => ElectionTurnouts(
  cast: (json['cast'] as num?)?.toInt(),
  collectionId: json['collectionId'] as String?,
  contestId: json['contestId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String,
  id: json['id'] as String,
  registered: (json['registered'] as num?)?.toInt(),
  rejected: (json['rejected'] as num?)?.toInt(),
  revision: (json['revision'] as num).toInt(),
  spoilt: (json['spoilt'] as num?)?.toInt(),
  status: $enumDecode(_$SharedFigureStatusEnumMap, json['status']),
  supersedesId: json['supersedesId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  valid: (json['valid'] as num?)?.toInt(),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ElectionTurnoutsToJson(ElectionTurnouts instance) => <String, dynamic>{
  'cast': ?instance.cast,
  'collectionId': ?instance.collectionId,
  'contestId': instance.contestId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': instance.featureId,
  'id': instance.id,
  'registered': ?instance.registered,
  'rejected': ?instance.rejected,
  'revision': instance.revision,
  'spoilt': ?instance.spoilt,
  'status': _$SharedFigureStatusEnumMap[instance.status]!,
  'supersedesId': ?instance.supersedesId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'valid': ?instance.valid,
  'version': instance.version,
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
