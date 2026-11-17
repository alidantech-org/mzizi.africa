// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feature_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyFeatureWindow _$GeographyFeatureWindowFromJson(Map<String, dynamic> json) => GeographyFeatureWindow(
  codePrefix: json['codePrefix'] as String?,
  featureTypeId: json['featureTypeId'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$GeographyFeatureWindowToJson(GeographyFeatureWindow instance) => <String, dynamic>{
  'codePrefix': ?instance.codePrefix,
  'featureTypeId': ?instance.featureTypeId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
