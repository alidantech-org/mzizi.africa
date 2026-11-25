// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scopes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthScopes _$AuthScopesFromJson(Map<String, dynamic> json) => AuthScopes(
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  featureId: json['featureId'] as String?,
  fieldGroup: json['fieldGroup'] as String?,
  id: json['id'] as String,
  includeDescendants: json['includeDescendants'] as bool,
  institutionId: json['institutionId'] as String?,
  isGlobal: json['isGlobal'] as bool,
  scopeHash: json['scopeHash'] as String,
);

Map<String, dynamic> _$AuthScopesToJson(AuthScopes instance) => <String, dynamic>{
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'featureId': ?instance.featureId,
  'fieldGroup': ?instance.fieldGroup,
  'id': instance.id,
  'includeDescendants': instance.includeDescendants,
  'institutionId': ?instance.institutionId,
  'isGlobal': instance.isGlobal,
  'scopeHash': instance.scopeHash,
};
