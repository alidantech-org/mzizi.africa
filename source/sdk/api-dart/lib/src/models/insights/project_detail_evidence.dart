import 'package:json_annotation/json_annotation.dart';

part 'project_detail_evidence.g.dart';

/// Project Detail Evidence
@JsonSerializable(includeIfNull: false)
class InsightsProjectDetailEvidence {
  const InsightsProjectDetailEvidence({
    required this.artifactTitle,
    required this.citationId,
    this.confidence,
    required this.locator,
    this.publisherName,
    required this.retrievedAt,
    required this.sourceName,
    this.verification,
  });
  final String artifactTitle;
  final String citationId;
  final double? confidence;
  final String locator;
  final String? publisherName;
  final String retrievedAt;
  final String sourceName;
  final String? verification;

  factory InsightsProjectDetailEvidence.fromJson(Map<String, dynamic> json) => _$InsightsProjectDetailEvidenceFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsProjectDetailEvidenceToJson(this);
}
