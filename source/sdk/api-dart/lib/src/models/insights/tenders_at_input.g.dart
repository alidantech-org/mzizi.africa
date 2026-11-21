// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tenders_at_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsTendersAtInput _$InsightsTendersAtInputFromJson(Map<String, dynamic> json) => InsightsTendersAtInput(
  countryCode: json['countryCode'] as String,
  languageCode: json['languageCode'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  path: json['path'] as String?,
  status: json['status'] as String?,
);

Map<String, dynamic> _$InsightsTendersAtInputToJson(InsightsTendersAtInput instance) => <String, dynamic>{
  'countryCode': instance.countryCode,
  'languageCode': ?instance.languageCode,
  'limit': ?instance.limit,
  'path': ?instance.path,
  'status': ?instance.status,
};
