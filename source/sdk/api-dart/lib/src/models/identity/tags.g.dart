// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tags.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IdentityTags _$IdentityTagsFromJson(Map<String, dynamic> json) => IdentityTags(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  identityId: json['identityId'] as String,
  tagTerm: json['tagTerm'] as String,
);

Map<String, dynamic> _$IdentityTagsToJson(IdentityTags instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'identityId': instance.identityId,
  'tagTerm': instance.tagTerm,
};
