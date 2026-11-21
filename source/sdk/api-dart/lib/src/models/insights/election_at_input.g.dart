// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_at_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsElectionAtInput _$InsightsElectionAtInputFromJson(Map<String, dynamic> json) => InsightsElectionAtInput(
  contestKind: json['contestKind'] as String?,
  countryCode: json['countryCode'] as String,
  electionId: json['electionId'] as String,
  languageCode: json['languageCode'] as String?,
  path: json['path'] as String?,
);

Map<String, dynamic> _$InsightsElectionAtInputToJson(InsightsElectionAtInput instance) => <String, dynamic>{
  'contestKind': ?instance.contestKind,
  'countryCode': instance.countryCode,
  'electionId': instance.electionId,
  'languageCode': ?instance.languageCode,
  'path': ?instance.path,
};
