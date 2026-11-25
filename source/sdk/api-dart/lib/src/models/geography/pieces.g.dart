// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pieces.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyPieces _$GeographyPiecesFromJson(Map<String, dynamic> json) => GeographyPieces(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String,
  geometry: json['geometry'],
  geometryId: json['geometryId'] as String,
  id: json['id'] as String,
);

Map<String, dynamic> _$GeographyPiecesToJson(GeographyPieces instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': instance.featureId,
  'geometry': ?instance.geometry,
  'geometryId': instance.geometryId,
  'id': instance.id,
};
