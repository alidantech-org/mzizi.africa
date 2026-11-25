// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'roles.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthRoles _$AuthRolesFromJson(Map<String, dynamic> json) => AuthRoles(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  description: json['description'] as String?,
  id: json['id'] as String,
  institutionId: json['institutionId'] as String?,
  policyVersion: json['policyVersion'] as String,
  protected: json['protected'] as bool,
  retiredAt: json['retiredAt'] == null ? null : DateTime.parse(json['retiredAt'] as String),
  title: json['title'] as String,
);

Map<String, dynamic> _$AuthRolesToJson(AuthRoles instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'description': ?instance.description,
  'id': instance.id,
  'institutionId': ?instance.institutionId,
  'policyVersion': instance.policyVersion,
  'protected': instance.protected,
  'retiredAt': ?instance.retiredAt?.toIso8601String(),
  'title': instance.title,
};
