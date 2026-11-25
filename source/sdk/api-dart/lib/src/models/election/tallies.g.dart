// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tallies.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionTallies _$ElectionTalliesFromJson(Map<String, dynamic> json) => ElectionTallies(
  basis: $enumDecode(_$SharedFigureBasisEnumMap, json['basis']),
  candidateId: json['candidateId'] as String?,
  choiceId: json['choiceId'] as String?,
  contestId: json['contestId'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  featureId: json['featureId'] as String,
  id: json['id'] as String,
  refreshedAt: DateTime.parse(json['refreshedAt'] as String),
  resultId: json['resultId'] as String,
  share: (json['share'] as num?)?.toDouble(),
  status: $enumDecode(_$SharedFigureStatusEnumMap, json['status']),
  votes: (json['votes'] as num?)?.toInt(),
);

Map<String, dynamic> _$ElectionTalliesToJson(ElectionTallies instance) => <String, dynamic>{
  'basis': _$SharedFigureBasisEnumMap[instance.basis]!,
  'candidateId': ?instance.candidateId,
  'choiceId': ?instance.choiceId,
  'contestId': instance.contestId,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'featureId': instance.featureId,
  'id': instance.id,
  'refreshedAt': instance.refreshedAt.toIso8601String(),
  'resultId': instance.resultId,
  'share': ?instance.share,
  'status': _$SharedFigureStatusEnumMap[instance.status]!,
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
