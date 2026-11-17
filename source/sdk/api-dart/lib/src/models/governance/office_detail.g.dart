// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'office_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceOfficeDetail _$GovernanceOfficeDetailFromJson(Map<String, dynamic> json) => GovernanceOfficeDetail(
  code: json['code'] as String,
  holders: (json['holders'] as List<dynamic>).map((e) => GovernanceOfficeDetailHolders.fromJson(e as Map<String, dynamic>)).toList(),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String,
  kind: json['kind'] as String,
  unitFeatureId: json['unitFeatureId'] as String?,
);

Map<String, dynamic> _$GovernanceOfficeDetailToJson(GovernanceOfficeDetail instance) => <String, dynamic>{
  'code': instance.code,
  'holders': instance.holders,
  'id': instance.id,
  'institutionId': instance.institutionId,
  'kind': instance.kind,
  'unitFeatureId': ?instance.unitFeatureId,
};
