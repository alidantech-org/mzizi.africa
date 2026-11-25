// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'components.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsComponents _$StatisticsComponentsFromJson(Map<String, dynamic> json) => StatisticsComponents(
  componentId: json['componentId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  indicatorId: json['indicatorId'] as String,
  position: (json['position'] as num?)?.toInt(),
  transformTerm: json['transformTerm'] as String,
  weight: (json['weight'] as num).toDouble(),
);

Map<String, dynamic> _$StatisticsComponentsToJson(StatisticsComponents instance) => <String, dynamic>{
  'componentId': instance.componentId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'indicatorId': instance.indicatorId,
  'position': ?instance.position,
  'transformTerm': instance.transformTerm,
  'weight': instance.weight,
};
