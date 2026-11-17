// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coded_created.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CodedCreated _$CodedCreatedFromJson(Map<String, dynamic> json) => CodedCreated(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  id: json['id'] as String,
);

Map<String, dynamic> _$CodedCreatedToJson(CodedCreated instance) =>
    <String, dynamic>{
      'code': instance.code,
      'createdAt': instance.createdAt.toIso8601String(),
      'id': instance.id,
    };
