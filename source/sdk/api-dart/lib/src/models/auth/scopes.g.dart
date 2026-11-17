// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scopes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthScopes _$AuthScopesFromJson(Map<String, dynamic> json) => AuthScopes(
  countryRefId: json['countryRefId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  datasetRefId: json['datasetRefId'] as String?,
  fieldGroup: json['fieldGroup'] as String?,
  geographicUnitRefId: json['geographicUnitRefId'] as String?,
  id: json['id'] as String,
  includeDescendants: json['includeDescendants'] as bool,
  institutionRefId: json['institutionRefId'] as String,
  isGlobal: json['isGlobal'] as bool,
  scopeHash: json['scopeHash'] as String,
);

Map<String, dynamic> _$AuthScopesToJson(AuthScopes instance) => <String, dynamic>{
  'countryRefId': ?instance.countryRefId,
  'createdAt': instance.createdAt.toIso8601String(),
  'datasetRefId': ?instance.datasetRefId,
  'fieldGroup': ?instance.fieldGroup,
  'geographicUnitRefId': ?instance.geographicUnitRefId,
  'id': instance.id,
  'includeDescendants': instance.includeDescendants,
  'institutionRefId': instance.institutionRefId,
  'isGlobal': instance.isGlobal,
  'scopeHash': instance.scopeHash,
};
