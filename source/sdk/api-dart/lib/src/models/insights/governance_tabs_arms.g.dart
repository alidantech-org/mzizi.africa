// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'governance_tabs_arms.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsGovernanceTabsArms _$InsightsGovernanceTabsArmsFromJson(Map<String, dynamic> json) => InsightsGovernanceTabsArms(
  about: json['about'] as String,
  code: json['code'] as String,
  institutions: (json['institutions'] as List<dynamic>)
      .map((e) => InsightsGovernanceTabsArmsInstitutions.fromJson(e as Map<String, dynamic>))
      .toList(),
  label: json['label'] as String,
);

Map<String, dynamic> _$InsightsGovernanceTabsArmsToJson(InsightsGovernanceTabsArms instance) => <String, dynamic>{
  'about': instance.about,
  'code': instance.code,
  'institutions': instance.institutions,
  'label': instance.label,
};
