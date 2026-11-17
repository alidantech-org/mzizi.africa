// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'validity_entity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ValidityEntity _$ValidityEntityFromJson(Map<String, dynamic> json) =>
    ValidityEntity(
      createdAt: DateTime.parse(json['createdAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
      id: json['id'] as String,
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      validFrom: json['validFrom'] == null
          ? null
          : DateTime.parse(json['validFrom'] as String),
      validUntil: json['validUntil'] == null
          ? null
          : DateTime.parse(json['validUntil'] as String),
      version: (json['version'] as num).toInt(),
    );

Map<String, dynamic> _$ValidityEntityToJson(ValidityEntity instance) =>
    <String, dynamic>{
      'createdAt': instance.createdAt.toIso8601String(),
      'deletedAt': ?instance.deletedAt?.toIso8601String(),
      'id': instance.id,
      'updatedAt': instance.updatedAt.toIso8601String(),
      'validFrom': ?instance.validFrom?.toIso8601String(),
      'validUntil': ?instance.validUntil?.toIso8601String(),
      'version': instance.version,
    };
