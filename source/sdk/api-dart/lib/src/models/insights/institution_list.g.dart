// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsInstitutionList _$InsightsInstitutionListFromJson(Map<String, dynamic> json) => InsightsInstitutionList(
  arms: json['arms'] as List<dynamic>,
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  total: (json['total'] as num).toInt(),
);

Map<String, dynamic> _$InsightsInstitutionListToJson(InsightsInstitutionList instance) => <String, dynamic>{
  'arms': instance.arms,
  'gaps': instance.gaps,
  'total': instance.total,
};
