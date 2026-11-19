import 'package:json_annotation/json_annotation.dart';

part 'leader_profile_evidence.g.dart';

/// Leader Profile Evidence
@JsonSerializable(includeIfNull: false)
class InsightsLeaderProfileEvidence {
  const InsightsLeaderProfileEvidence({
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

  factory InsightsLeaderProfileEvidence.fromJson(Map<String, dynamic> json) => _$InsightsLeaderProfileEvidenceFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderProfileEvidenceToJson(this);
}
