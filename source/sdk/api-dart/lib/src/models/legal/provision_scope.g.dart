// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'provision_scope.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalProvisionScope _$LegalProvisionScopeFromJson(Map<String, dynamic> json) => LegalProvisionScope(
  instrumentId: json['instrumentId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$LegalProvisionScopeToJson(LegalProvisionScope instance) => <String, dynamic>{
  'instrumentId': instance.instrumentId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
