// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'created.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Created _$CreatedFromJson(Map<String, dynamic> json) => Created(
  createdAt: DateTime.parse(json['createdAt'] as String),
  id: json['id'] as String,
);

Map<String, dynamic> _$CreatedToJson(Created instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'id': instance.id,
};
