// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicProjectDetail _$CivicProjectDetailFromJson(Map<String, dynamic> json) => CivicProjectDetail(
  code: json['code'] as String,
  contracts: (json['contracts'] as List<dynamic>).map((e) => CivicProjectDetailContracts.fromJson(e as Map<String, dynamic>)).toList(),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  implementerId: json['implementerId'] as String?,
  institutionId: json['institutionId'] as String?,
  names: (json['names'] as List<dynamic>).map((e) => CivicProjectDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  projectId: json['projectId'] as String,
  sites: (json['sites'] as List<dynamic>).map((e) => CivicProjectDetailSites.fromJson(e as Map<String, dynamic>)).toList(),
  sponsorId: json['sponsorId'] as String?,
  statusTerm: json['statusTerm'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$CivicProjectDetailToJson(CivicProjectDetail instance) => <String, dynamic>{
  'code': instance.code,
  'contracts': instance.contracts,
  'fromYear': ?instance.fromYear,
  'implementerId': ?instance.implementerId,
  'institutionId': ?instance.institutionId,
  'names': instance.names,
  'projectId': instance.projectId,
  'sites': instance.sites,
  'sponsorId': ?instance.sponsorId,
  'statusTerm': instance.statusTerm,
  'toYear': ?instance.toYear,
};
