// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dimensions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsDimensions _$StatisticsDimensionsFromJson(Map<String, dynamic> json) => StatisticsDimensions(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  indicatorId: json['indicatorId'] as String,
  isRequired: json['isRequired'] as bool,
  position: (json['position'] as num).toInt(),
  schemeId: json['schemeId'] as String,
);

Map<String, dynamic> _$StatisticsDimensionsToJson(StatisticsDimensions instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'indicatorId': instance.indicatorId,
  'isRequired': instance.isRequired,
  'position': instance.position,
  'schemeId': instance.schemeId,
};
