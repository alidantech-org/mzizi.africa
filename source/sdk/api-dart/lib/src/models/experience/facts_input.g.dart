// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'facts_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceFactsInput _$ExperienceFactsInputFromJson(Map<String, dynamic> json) =>
    ExperienceFactsInput(featureId: json['featureId'] as String?, limit: (json['limit'] as num?)?.toInt());

Map<String, dynamic> _$ExperienceFactsInputToJson(ExperienceFactsInput instance) => <String, dynamic>{
  'featureId': ?instance.featureId,
  'limit': ?instance.limit,
};
