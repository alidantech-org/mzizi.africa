// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motions_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsMotionsInput _$InsightsMotionsInputFromJson(Map<String, dynamic> json) =>
    InsightsMotionsInput(institutionId: json['institutionId'] as String?, limit: (json['limit'] as num?)?.toInt());

Map<String, dynamic> _$InsightsMotionsInputToJson(InsightsMotionsInput instance) => <String, dynamic>{
  'institutionId': ?instance.institutionId,
  'limit': ?instance.limit,
};
