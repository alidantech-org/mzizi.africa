// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsInstitutionDetail _$InsightsInstitutionDetailFromJson(Map<String, dynamic> json) => InsightsInstitutionDetail(
  children: json['children'] as List<dynamic>,
  content: json['content'] as List<dynamic>,
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  institution: json['institution'],
  leaders: json['leaders'] as List<dynamic>,
  legalBasis: json['legalBasis'] as List<dynamic>,
  metrics: json['metrics'] as List<dynamic>,
  parents: json['parents'] as List<dynamic>,
);

Map<String, dynamic> _$InsightsInstitutionDetailToJson(InsightsInstitutionDetail instance) => <String, dynamic>{
  'children': instance.children,
  'content': instance.content,
  'gaps': instance.gaps,
  'institution': ?instance.institution,
  'leaders': instance.leaders,
  'legalBasis': instance.legalBasis,
  'metrics': instance.metrics,
  'parents': instance.parents,
};
