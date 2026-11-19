// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'governance_tabs.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsGovernanceTabs _$InsightsGovernanceTabsFromJson(Map<String, dynamic> json) => InsightsGovernanceTabs(
  arms: (json['arms'] as List<dynamic>).map((e) => InsightsGovernanceTabsArms.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  tabs: (json['tabs'] as List<dynamic>).map((e) => InsightsGovernanceTabsTabs.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsGovernanceTabsToJson(InsightsGovernanceTabs instance) => <String, dynamic>{
  'arms': instance.arms,
  'gaps': instance.gaps,
  'tabs': instance.tabs,
};
