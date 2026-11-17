// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'timestamped.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SharedTimestamped _$SharedTimestampedFromJson(Map<String, dynamic> json) => SharedTimestamped(
  createdAt: DateTime.parse(json['createdAt'] as String),
  id: json['id'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$SharedTimestampedToJson(SharedTimestamped instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'id': instance.id,
  'updatedAt': instance.updatedAt.toIso8601String(),
};
