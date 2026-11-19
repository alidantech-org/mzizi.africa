// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'governance_tabs_tabs.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsGovernanceTabsTabs _$InsightsGovernanceTabsTabsFromJson(Map<String, dynamic> json) => InsightsGovernanceTabsTabs(
  about: json['about'] as String,
  code: json['code'] as String,
  count: (json['count'] as num).toDouble(),
  includes: (json['includes'] as List<dynamic>).map((e) => e as String).toList(),
  kind: json['kind'] as String,
  label: json['label'] as String,
);

Map<String, dynamic> _$InsightsGovernanceTabsTabsToJson(InsightsGovernanceTabsTabs instance) => <String, dynamic>{
  'about': instance.about,
  'code': instance.code,
  'count': instance.count,
  'includes': instance.includes,
  'kind': instance.kind,
  'label': instance.label,
};
