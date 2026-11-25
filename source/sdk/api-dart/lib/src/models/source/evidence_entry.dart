import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/source/evidence_method.dart';
import 'package:mzizi_api/src/enums/source/evidence_role.dart';

part 'evidence_entry.g.dart';

/// Evidence Entry
@JsonSerializable(includeIfNull: false)
class SourceEvidenceEntry {
  const SourceEvidenceEntry({
    this.artifactId,
    this.confidence,
    this.editionDesignation,
    required this.evidenceId,
    required this.locator,
    required this.locatorTerm,
    required this.method,
    this.observedAt,
    this.productCode,
    this.publisherCode,
    required this.role,
  });
  final String? artifactId;
  final double? confidence;
  final String? editionDesignation;
  final String evidenceId;
  final String locator;
  final String locatorTerm;
  final SourceEvidenceMethod method;
  final DateTime? observedAt;
  final String? productCode;
  final String? publisherCode;
  final SourceEvidenceRole role;

  factory SourceEvidenceEntry.fromJson(Map<String, dynamic> json) => _$SourceEvidenceEntryFromJson(json);

  Map<String, dynamic> toJson() => _$SourceEvidenceEntryToJson(this);
}
