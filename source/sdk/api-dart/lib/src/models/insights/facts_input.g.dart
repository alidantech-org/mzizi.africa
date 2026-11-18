// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'facts_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsFactsInput _$InsightsFactsInputFromJson(Map<String, dynamic> json) =>
    InsightsFactsInput(featureId: json['featureId'] as String?, limit: (json['limit'] as num?)?.toInt());

Map<String, dynamic> _$InsightsFactsInputToJson(InsightsFactsInput instance) => <String, dynamic>{
  'featureId': ?instance.featureId,
  'limit': ?instance.limit,
};
