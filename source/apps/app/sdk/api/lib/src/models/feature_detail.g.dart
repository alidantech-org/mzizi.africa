// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feature_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FeatureDetail _$FeatureDetailFromJson(Map<String, dynamic> json) =>
    FeatureDetail(
      code: json['code'] as String,
      featureId: json['featureId'] as String,
      featureTypeId: json['featureTypeId'] as String,
      names: (json['names'] as List<dynamic>)
          .map((e) => FeatureDetailNames.fromJson(e as Map<String, dynamic>))
          .toList(),
      validFrom: json['validFrom'] == null
          ? null
          : DateTime.parse(json['validFrom'] as String),
      validUntil: json['validUntil'] == null
          ? null
          : DateTime.parse(json['validUntil'] as String),
    );

Map<String, dynamic> _$FeatureDetailToJson(FeatureDetail instance) =>
    <String, dynamic>{
      'code': instance.code,
      'featureId': instance.featureId,
      'featureTypeId': instance.featureTypeId,
      'names': instance.names,
      'validFrom': ?instance.validFrom?.toIso8601String(),
      'validUntil': ?instance.validUntil?.toIso8601String(),
    };
