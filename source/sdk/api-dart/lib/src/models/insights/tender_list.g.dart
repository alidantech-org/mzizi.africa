// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tender_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsTenderList _$InsightsTenderListFromJson(Map<String, dynamic> json) => InsightsTenderList(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  summary: json['summary'],
  tenders: json['tenders'] as List<dynamic>,
);

Map<String, dynamic> _$InsightsTenderListToJson(InsightsTenderList instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'summary': ?instance.summary,
  'tenders': instance.tenders,
};
