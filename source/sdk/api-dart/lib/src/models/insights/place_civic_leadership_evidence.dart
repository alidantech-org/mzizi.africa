import 'package:json_annotation/json_annotation.dart';

part 'place_civic_leadership_evidence.g.dart';

/// Place Civic Leadership Evidence
@JsonSerializable(includeIfNull: false)
class InsightsPlaceCivicLeadershipEvidence {
  const InsightsPlaceCivicLeadershipEvidence({
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

  factory InsightsPlaceCivicLeadershipEvidence.fromJson(Map<String, dynamic> json) => _$InsightsPlaceCivicLeadershipEvidenceFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceCivicLeadershipEvidenceToJson(this);
}
