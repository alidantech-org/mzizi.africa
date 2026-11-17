// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceInstitutionDetail _$GovernanceInstitutionDetailFromJson(Map<String, dynamic> json) => GovernanceInstitutionDetail(
  code: json['code'] as String,
  id: json['id'] as String,
  kind: json['kind'] as String,
  mandates: (json['mandates'] as List<dynamic>).map((e) => GovernanceInstitutionDetailMandates.fromJson(e as Map<String, dynamic>)).toList(),
  names: (json['names'] as List<dynamic>).map((e) => GovernanceInstitutionDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  offices: (json['offices'] as List<dynamic>).map((e) => GovernanceInstitutionDetailOffices.fromJson(e as Map<String, dynamic>)).toList(),
  validFrom: json['validFrom'] == null ? null : DateTime.parse(json['validFrom'] as String),
  validUntil: json['validUntil'] == null ? null : DateTime.parse(json['validUntil'] as String),
);

Map<String, dynamic> _$GovernanceInstitutionDetailToJson(GovernanceInstitutionDetail instance) => <String, dynamic>{
  'code': instance.code,
  'id': instance.id,
  'kind': instance.kind,
  'mandates': instance.mandates,
  'names': instance.names,
  'offices': instance.offices,
  'validFrom': ?instance.validFrom?.toIso8601String(),
  'validUntil': ?instance.validUntil?.toIso8601String(),
};
