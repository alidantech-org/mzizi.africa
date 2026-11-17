// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'association.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Association _$AssociationFromJson(Map<String, dynamic> json) => Association(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null
      ? null
      : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
);

Map<String, dynamic> _$AssociationToJson(Association instance) =>
    <String, dynamic>{
      'createdAt': instance.createdAt.toIso8601String(),
      'deletedAt': ?instance.deletedAt?.toIso8601String(),
      'id': instance.id,
    };
