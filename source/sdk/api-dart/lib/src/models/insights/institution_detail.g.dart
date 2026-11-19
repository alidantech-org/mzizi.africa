// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsInstitutionDetail _$InsightsInstitutionDetailFromJson(Map<String, dynamic> json) => InsightsInstitutionDetail(
  children: (json['children'] as List<dynamic>).map((e) => InsightsInstitutionDetailChildren.fromJson(e as Map<String, dynamic>)).toList(),
  content: (json['content'] as List<dynamic>).map((e) => InsightsInstitutionDetailContent.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  institution: InsightsInstitutionDetailInstitution.fromJson(json['institution'] as Map<String, dynamic>),
  leaders: (json['leaders'] as List<dynamic>).map((e) => InsightsInstitutionDetailLeaders.fromJson(e as Map<String, dynamic>)).toList(),
  legalBasis: (json['legalBasis'] as List<dynamic>).map((e) => InsightsInstitutionDetailLegalBasis.fromJson(e as Map<String, dynamic>)).toList(),
  metrics: (json['metrics'] as List<dynamic>).map((e) => InsightsInstitutionDetailMetrics.fromJson(e as Map<String, dynamic>)).toList(),
  parents: (json['parents'] as List<dynamic>).map((e) => InsightsInstitutionDetailParents.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsInstitutionDetailToJson(InsightsInstitutionDetail instance) => <String, dynamic>{
  'children': instance.children,
  'content': instance.content,
  'gaps': instance.gaps,
  'institution': instance.institution,
  'leaders': instance.leaders,
  'legalBasis': instance.legalBasis,
  'metrics': instance.metrics,
  'parents': instance.parents,
};
