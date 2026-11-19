// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_list_arms_groups.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsInstitutionListArmsGroups _$InsightsInstitutionListArmsGroupsFromJson(Map<String, dynamic> json) => InsightsInstitutionListArmsGroups(
  institutions: (json['institutions'] as List<dynamic>)
      .map((e) => InsightsInstitutionListArmsGroupsInstitutions.fromJson(e as Map<String, dynamic>))
      .toList(),
  kind: InsightsInstitutionListArmsGroupsKind.fromJson(json['kind'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsInstitutionListArmsGroupsToJson(InsightsInstitutionListArmsGroups instance) => <String, dynamic>{
  'institutions': instance.institutions,
  'kind': instance.kind,
};
