// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'timestamped.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Timestamped _$TimestampedFromJson(Map<String, dynamic> json) => Timestamped(
  createdAt: DateTime.parse(json['createdAt'] as String),
  id: json['id'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$TimestampedToJson(Timestamped instance) =>
    <String, dynamic>{
      'createdAt': instance.createdAt.toIso8601String(),
      'id': instance.id,
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
