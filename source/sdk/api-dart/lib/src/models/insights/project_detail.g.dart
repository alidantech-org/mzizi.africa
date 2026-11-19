// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsProjectDetail _$InsightsProjectDetailFromJson(Map<String, dynamic> json) => InsightsProjectDetail(
  evidence: (json['evidence'] as List<dynamic>).map((e) => InsightsProjectDetailEvidence.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  media: (json['media'] as List<dynamic>).map((e) => InsightsProjectDetailMedia.fromJson(e as Map<String, dynamic>)).toList(),
  money: json['money'] as List<dynamic>,
  procurement: InsightsProjectDetailProcurement.fromJson(json['procurement'] as Map<String, dynamic>),
  project: InsightsProjectDetailProject.fromJson(json['project'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsProjectDetailToJson(InsightsProjectDetail instance) => <String, dynamic>{
  'evidence': instance.evidence,
  'gaps': instance.gaps,
  'media': instance.media,
  'money': instance.money,
  'procurement': instance.procurement,
  'project': instance.project,
};
