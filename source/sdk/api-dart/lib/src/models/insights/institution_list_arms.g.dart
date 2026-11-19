// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_list_arms.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsInstitutionListArms _$InsightsInstitutionListArmsFromJson(Map<String, dynamic> json) => InsightsInstitutionListArms(
  about: json['about'] as String,
  code: json['code'] as String,
  count: (json['count'] as num).toDouble(),
  groups: (json['groups'] as List<dynamic>).map((e) => InsightsInstitutionListArmsGroups.fromJson(e as Map<String, dynamic>)).toList(),
  label: json['label'] as String,
);

Map<String, dynamic> _$InsightsInstitutionListArmsToJson(InsightsInstitutionListArms instance) => <String, dynamic>{
  'about': instance.about,
  'code': instance.code,
  'count': instance.count,
  'groups': instance.groups,
  'label': instance.label,
};
