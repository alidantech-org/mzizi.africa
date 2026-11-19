// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'governance_tabs_arms_institutions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsGovernanceTabsArmsInstitutions _$InsightsGovernanceTabsArmsInstitutionsFromJson(Map<String, dynamic> json) =>
    InsightsGovernanceTabsArmsInstitutions(
      code: json['code'] as String,
      image: json['image'] as String?,
      kind: InsightsGovernanceTabsArmsInstitutionsKind.fromJson(json['kind'] as Map<String, dynamic>),
      leaders: (json['leaders'] as num).toDouble(),
      name: json['name'] as String,
    );

Map<String, dynamic> _$InsightsGovernanceTabsArmsInstitutionsToJson(InsightsGovernanceTabsArmsInstitutions instance) => <String, dynamic>{
  'code': instance.code,
  'image': ?instance.image,
  'kind': instance.kind,
  'leaders': instance.leaders,
  'name': instance.name,
};
