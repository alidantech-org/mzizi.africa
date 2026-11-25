// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'evidence_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceEvidenceCollection _$SourceEvidenceCollectionFromJson(Map<String, dynamic> json) => SourceEvidenceCollection(
  evidence: (json['evidence'] as List<dynamic>).map((e) => SourceEvidenceEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$SourceEvidenceCollectionToJson(SourceEvidenceCollection instance) => <String, dynamic>{'evidence': instance.evidence};
