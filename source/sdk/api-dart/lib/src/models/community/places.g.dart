// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'places.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityPlaces _$CommunityPlacesFromJson(Map<String, dynamic> json) => CommunityPlaces(
  actorId: json['actorId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String,
  id: json['id'] as String,
  isHome: json['isHome'] as bool,
  label: json['label'] as String,
  position: (json['position'] as num?)?.toInt(),
  suggestionTerm: json['suggestionTerm'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CommunityPlacesToJson(CommunityPlaces instance) => <String, dynamic>{
  'actorId': instance.actorId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': instance.featureId,
  'id': instance.id,
  'isHome': instance.isHome,
  'label': instance.label,
  'position': ?instance.position,
  'suggestionTerm': ?instance.suggestionTerm,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
