// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feature_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FeatureEntry _$FeatureEntryFromJson(Map<String, dynamic> json) => FeatureEntry(
  code: json['code'] as String,
  featureId: json['featureId'] as String,
  featureTypeId: json['featureTypeId'] as String,
  names: (json['names'] as List<dynamic>)
      .map((e) => FeatureEntryNames.fromJson(e as Map<String, dynamic>))
      .toList(),
  validFrom: json['validFrom'] == null
      ? null
      : DateTime.parse(json['validFrom'] as String),
  validUntil: json['validUntil'] == null
      ? null
      : DateTime.parse(json['validUntil'] as String),
);

Map<String, dynamic> _$FeatureEntryToJson(FeatureEntry instance) =>
    <String, dynamic>{
      'code': instance.code,
      'featureId': instance.featureId,
      'featureTypeId': instance.featureTypeId,
      'names': instance.names,
      'validFrom': ?instance.validFrom?.toIso8601String(),
      'validUntil': ?instance.validUntil?.toIso8601String(),
    };
