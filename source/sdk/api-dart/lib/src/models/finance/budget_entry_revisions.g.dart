// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'budget_entry_revisions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceBudgetEntryRevisions _$FinanceBudgetEntryRevisionsFromJson(Map<String, dynamic> json) => FinanceBudgetEntryRevisions(
  releasedOn: json['releasedOn'] == null ? null : DateTime.parse(json['releasedOn'] as String),
  revision: (json['revision'] as num).toInt(),
  revisionId: json['revisionId'] as String,
  statusTerm: json['statusTerm'] as String,
);

Map<String, dynamic> _$FinanceBudgetEntryRevisionsToJson(FinanceBudgetEntryRevisions instance) => <String, dynamic>{
  'releasedOn': ?instance.releasedOn?.toIso8601String(),
  'revision': instance.revision,
  'revisionId': instance.revisionId,
  'statusTerm': instance.statusTerm,
};
