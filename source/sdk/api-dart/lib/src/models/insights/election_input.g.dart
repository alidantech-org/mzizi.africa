// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsElectionInput _$InsightsElectionInputFromJson(Map<String, dynamic> json) => InsightsElectionInput(
  contestKind: json['contestKind'] as String?,
  electionId: json['electionId'] as String,
  parentFeatureId: json['parentFeatureId'] as String?,
);

Map<String, dynamic> _$InsightsElectionInputToJson(InsightsElectionInput instance) => <String, dynamic>{
  'contestKind': ?instance.contestKind,
  'electionId': instance.electionId,
  'parentFeatureId': ?instance.parentFeatureId,
};
