// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'weights.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EconomyWeights _$EconomyWeightsFromJson(Map<String, dynamic> json) => EconomyWeights(
  basketId: json['basketId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  goodId: json['goodId'] as String,
  id: json['id'] as String,
  weight: (json['weight'] as num).toDouble(),
);

Map<String, dynamic> _$EconomyWeightsToJson(EconomyWeights instance) => <String, dynamic>{
  'basketId': instance.basketId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'goodId': instance.goodId,
  'id': instance.id,
  'weight': instance.weight,
};
