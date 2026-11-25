// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tally_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionTallyEntry _$ElectionTallyEntryFromJson(Map<String, dynamic> json) => ElectionTallyEntry(
  basis: $enumDecode(_$SharedFigureBasisEnumMap, json['basis']),
  candidateId: json['candidateId'] as String?,
  choiceId: json['choiceId'] as String?,
  contestId: json['contestId'] as String,
  refreshedAt: DateTime.parse(json['refreshedAt'] as String),
  share: (json['share'] as num?)?.toDouble(),
  status: $enumDecode(_$SharedFigureStatusEnumMap, json['status']),
  votes: (json['votes'] as num?)?.toInt(),
);

Map<String, dynamic> _$ElectionTallyEntryToJson(ElectionTallyEntry instance) => <String, dynamic>{
  'basis': _$SharedFigureBasisEnumMap[instance.basis]!,
  'candidateId': ?instance.candidateId,
  'choiceId': ?instance.choiceId,
  'contestId': instance.contestId,
  'refreshedAt': instance.refreshedAt.toIso8601String(),
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
