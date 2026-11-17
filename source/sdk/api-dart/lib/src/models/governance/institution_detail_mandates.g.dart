// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail_mandates.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceInstitutionDetailMandates _$GovernanceInstitutionDetailMandatesFromJson(Map<String, dynamic> json) =>
    GovernanceInstitutionDetailMandates(
      description: json['description'] as String,
      kind: json['kind'] as String,
      validFrom: json['validFrom'] == null ? null : DateTime.parse(json['validFrom'] as String),
      validUntil: json['validUntil'] == null ? null : DateTime.parse(json['validUntil'] as String),
    );

Map<String, dynamic> _$GovernanceInstitutionDetailMandatesToJson(GovernanceInstitutionDetailMandates instance) => <String, dynamic>{
  'description': instance.description,
  'kind': instance.kind,
  'validFrom': ?instance.validFrom?.toIso8601String(),
  'validUntil': ?instance.validUntil?.toIso8601String(),
};
