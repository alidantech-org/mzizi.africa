// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'references.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalReferences _$LegalReferencesFromJson(Map<String, dynamic> json) => LegalReferences(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  method: $enumDecode(_$LegalReferenceMethodEnumMap, json['method']),
  relation: $enumDecode(_$LegalReferenceRelationEnumMap, json['relation']),
  reviewStatus: $enumDecode(_$LegalReviewStatusEnumMap, json['reviewStatus']),
  spanEnd: (json['spanEnd'] as num).toInt(),
  spanStart: (json['spanStart'] as num).toInt(),
  spanText: json['spanText'] as String,
  targetProvisionId: json['targetProvisionId'] as String,
  targetWordingId: json['targetWordingId'] as String?,
  translationId: json['translationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  wordingId: json['wordingId'] as String?,
);

Map<String, dynamic> _$LegalReferencesToJson(LegalReferences instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'method': _$LegalReferenceMethodEnumMap[instance.method]!,
  'relation': _$LegalReferenceRelationEnumMap[instance.relation]!,
  'reviewStatus': _$LegalReviewStatusEnumMap[instance.reviewStatus]!,
  'spanEnd': instance.spanEnd,
  'spanStart': instance.spanStart,
  'spanText': instance.spanText,
  'targetProvisionId': instance.targetProvisionId,
  'targetWordingId': ?instance.targetWordingId,
  'translationId': ?instance.translationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'wordingId': ?instance.wordingId,
};

const _$LegalReferenceMethodEnumMap = {
  LegalReferenceMethod.human: 'human',
  LegalReferenceMethod.model: 'model',
  LegalReferenceMethod.parser: 'parser',
};

const _$LegalReferenceRelationEnumMap = {
  LegalReferenceRelation.amends: 'amends',
  LegalReferenceRelation.asDefinedIn: 'as-defined-in',
  LegalReferenceRelation.inAccordanceWith: 'in-accordance-with',
  LegalReferenceRelation.readWith: 'read-with',
  LegalReferenceRelation.refersTo: 'refers-to',
  LegalReferenceRelation.repeals: 'repeals',
  LegalReferenceRelation.subjectTo: 'subject-to',
  LegalReferenceRelation.under: 'under',
};

const _$LegalReviewStatusEnumMap = {
  LegalReviewStatus.accepted: 'accepted',
  LegalReviewStatus.proposed: 'proposed',
  LegalReviewStatus.rejected: 'rejected',
  LegalReviewStatus.reviewed: 'reviewed',
};
