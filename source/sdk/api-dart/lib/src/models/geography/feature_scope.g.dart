// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feature_scope.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyFeatureScope _$GeographyFeatureScopeFromJson(Map<String, dynamic> json) => GeographyFeatureScope(
  featureId: json['featureId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$GeographyFeatureScopeToJson(GeographyFeatureScope instance) => <String, dynamic>{
  'featureId': instance.featureId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
