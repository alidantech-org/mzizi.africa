// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'evidence_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceEvidenceEntry _$SourceEvidenceEntryFromJson(Map<String, dynamic> json) => SourceEvidenceEntry(
  artifactId: json['artifactId'] as String?,
  confidence: (json['confidence'] as num?)?.toDouble(),
  editionDesignation: json['editionDesignation'] as String?,
  evidenceId: json['evidenceId'] as String,
  locator: json['locator'] as String,
  locatorTerm: json['locatorTerm'] as String,
  method: $enumDecode(_$SourceEvidenceMethodEnumMap, json['method']),
  observedAt: json['observedAt'] == null ? null : DateTime.parse(json['observedAt'] as String),
  productCode: json['productCode'] as String?,
  publisherCode: json['publisherCode'] as String?,
  role: $enumDecode(_$SourceEvidenceRoleEnumMap, json['role']),
);

Map<String, dynamic> _$SourceEvidenceEntryToJson(SourceEvidenceEntry instance) => <String, dynamic>{
  'artifactId': ?instance.artifactId,
  'confidence': ?instance.confidence,
  'editionDesignation': ?instance.editionDesignation,
  'evidenceId': instance.evidenceId,
  'locator': instance.locator,
  'locatorTerm': instance.locatorTerm,
  'method': _$SourceEvidenceMethodEnumMap[instance.method]!,
  'observedAt': ?instance.observedAt?.toIso8601String(),
  'productCode': ?instance.productCode,
  'publisherCode': ?instance.publisherCode,
  'role': _$SourceEvidenceRoleEnumMap[instance.role]!,
};

const _$SourceEvidenceMethodEnumMap = {
  SourceEvidenceMethod.extracted: 'extracted',
  SourceEvidenceMethod.manual: 'manual',
  SourceEvidenceMethod.matched: 'matched',
  SourceEvidenceMethod.modelled: 'modelled',
};

const _$SourceEvidenceRoleEnumMap = {
  SourceEvidenceRole.contradicts: 'contradicts',
  SourceEvidenceRole.origin: 'origin',
  SourceEvidenceRole.supports: 'supports',
};
