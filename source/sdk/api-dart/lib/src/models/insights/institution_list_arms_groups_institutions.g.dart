// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_list_arms_groups_institutions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsInstitutionListArmsGroupsInstitutions _$InsightsInstitutionListArmsGroupsInstitutionsFromJson(Map<String, dynamic> json) =>
    InsightsInstitutionListArmsGroupsInstitutions(
      arm: InsightsInstitutionListArmsGroupsInstitutionsArm.fromJson(json['arm'] as Map<String, dynamic>),
      basis: InsightsInstitutionListArmsGroupsInstitutionsBasis.fromJson(json['basis'] as Map<String, dynamic>),
      children: (json['children'] as num).toDouble(),
      code: json['code'] as String,
      image: json['image'] as String?,
      kind: InsightsInstitutionListArmsGroupsInstitutionsKind.fromJson(json['kind'] as Map<String, dynamic>),
      leaders: (json['leaders'] as num).toDouble(),
      name: json['name'] as String,
      parent: json['parent'] == null
          ? null
          : InsightsInstitutionListArmsGroupsInstitutionsParent.fromJson(json['parent'] as Map<String, dynamic>),
      purpose: json['purpose'] as String,
    );

Map<String, dynamic> _$InsightsInstitutionListArmsGroupsInstitutionsToJson(InsightsInstitutionListArmsGroupsInstitutions instance) =>
    <String, dynamic>{
      'arm': instance.arm,
      'basis': instance.basis,
      'children': instance.children,
      'code': instance.code,
      'image': ?instance.image,
      'kind': instance.kind,
      'leaders': instance.leaders,
      'name': instance.name,
      'parent': ?instance.parent,
      'purpose': instance.purpose,
    };
