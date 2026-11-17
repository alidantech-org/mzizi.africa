// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feature_kind_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyFeatureKindCollection _$GeographyFeatureKindCollectionFromJson(Map<String, dynamic> json) => GeographyFeatureKindCollection(
  kinds: (json['kinds'] as List<dynamic>).map((e) => GeographyFeatureKind.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GeographyFeatureKindCollectionToJson(GeographyFeatureKindCollection instance) => <String, dynamic>{
  'kinds': instance.kinds,
};
