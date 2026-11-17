// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feature_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FeatureWindow _$FeatureWindowFromJson(Map<String, dynamic> json) =>
    FeatureWindow(
      codePrefix: json['codePrefix'] as String?,
      featureTypeId: json['featureTypeId'] as String?,
      limit: (json['limit'] as num?)?.toInt(),
      offset: (json['offset'] as num?)?.toInt(),
    );

Map<String, dynamic> _$FeatureWindowToJson(FeatureWindow instance) =>
    <String, dynamic>{
      'codePrefix': ?instance.codePrefix,
      'featureTypeId': ?instance.featureTypeId,
      'limit': ?instance.limit,
      'offset': ?instance.offset,
    };
