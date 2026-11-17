// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feature_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FeatureCollection _$FeatureCollectionFromJson(Map<String, dynamic> json) =>
    FeatureCollection(
      features: (json['features'] as List<dynamic>)
          .map((e) => FeatureEntry.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$FeatureCollectionToJson(FeatureCollection instance) =>
    <String, dynamic>{'features': instance.features};
