// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail_institution.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsInstitutionDetailInstitution _$InsightsInstitutionDetailInstitutionFromJson(Map<String, dynamic> json) =>
    InsightsInstitutionDetailInstitution(
      arm: InsightsInstitutionDetailInstitutionArm.fromJson(json['arm'] as Map<String, dynamic>),
      basis: InsightsInstitutionDetailInstitutionBasis.fromJson(json['basis'] as Map<String, dynamic>),
      children: (json['children'] as num).toDouble(),
      code: json['code'] as String,
      established: json['established'] as String?,
      functions: (json['functions'] as List<dynamic>).map((e) => e as String).toList(),
      image: json['image'] as String?,
      kind: InsightsInstitutionDetailInstitutionKind.fromJson(json['kind'] as Map<String, dynamic>),
      leaders: (json['leaders'] as num).toDouble(),
      name: json['name'] as String,
      parent: json['parent'] == null ? null : InsightsInstitutionDetailInstitutionParent.fromJson(json['parent'] as Map<String, dynamic>),
      purpose: json['purpose'] as String,
    );

Map<String, dynamic> _$InsightsInstitutionDetailInstitutionToJson(InsightsInstitutionDetailInstitution instance) => <String, dynamic>{
  'arm': instance.arm,
  'basis': instance.basis,
  'children': instance.children,
  'code': instance.code,
  'established': ?instance.established,
  'functions': instance.functions,
  'image': ?instance.image,
  'kind': instance.kind,
  'leaders': instance.leaders,
  'name': instance.name,
  'parent': ?instance.parent,
  'purpose': instance.purpose,
};
