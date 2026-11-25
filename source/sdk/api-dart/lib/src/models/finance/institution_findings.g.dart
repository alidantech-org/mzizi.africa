// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_findings.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceInstitutionFindings _$FinanceInstitutionFindingsFromJson(Map<String, dynamic> json) => FinanceInstitutionFindings(
  institutionId: json['institutionId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$FinanceInstitutionFindingsToJson(FinanceInstitutionFindings instance) => <String, dynamic>{
  'institutionId': instance.institutionId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
