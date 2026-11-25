// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'subjects.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MediaSubjects _$MediaSubjectsFromJson(Map<String, dynamic> json) => MediaSubjects(
  articleId: json['articleId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  identityId: json['identityId'] as String,
  roleTerm: json['roleTerm'] as String,
);

Map<String, dynamic> _$MediaSubjectsToJson(MediaSubjects instance) => <String, dynamic>{
  'articleId': instance.articleId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'identityId': instance.identityId,
  'roleTerm': instance.roleTerm,
};
