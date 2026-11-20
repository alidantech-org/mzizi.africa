// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'children_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerChildrenInput _$ExplorerChildrenInputFromJson(Map<String, dynamic> json) => ExplorerChildrenInput(
  countryCode: json['countryCode'] as String,
  featureId: json['featureId'] as String?,
  languageCode: json['languageCode'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  page: (json['page'] as num?)?.toInt(),
);

Map<String, dynamic> _$ExplorerChildrenInputToJson(ExplorerChildrenInput instance) => <String, dynamic>{
  'countryCode': instance.countryCode,
  'featureId': ?instance.featureId,
  'languageCode': ?instance.languageCode,
  'limit': ?instance.limit,
  'page': ?instance.page,
};
