// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'created.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SharedCreated _$SharedCreatedFromJson(Map<String, dynamic> json) =>
    SharedCreated(createdAt: DateTime.parse(json['createdAt'] as String), id: json['id'] as String);

Map<String, dynamic> _$SharedCreatedToJson(SharedCreated instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'id': instance.id,
};
