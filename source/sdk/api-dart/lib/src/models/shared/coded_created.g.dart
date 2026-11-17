// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coded_created.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SharedCodedCreated _$SharedCodedCreatedFromJson(Map<String, dynamic> json) =>
    SharedCodedCreated(code: json['code'] as String, createdAt: DateTime.parse(json['createdAt'] as String), id: json['id'] as String);

Map<String, dynamic> _$SharedCodedCreatedToJson(SharedCodedCreated instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'id': instance.id,
};
