import 'package:json_annotation/json_annotation.dart';

part 'evidence_ref.g.dart';

/// Evidence Ref
@JsonSerializable(includeIfNull: false)
class LocalityEvidenceRef {
  const LocalityEvidenceRef({
    this.artifactTitle,
    required this.citationId,
    this.confidence,
    this.locator,
    this.publisherName,
    this.retrievedAt,
    required this.sourceName,
    this.verification,
  });
  final String? artifactTitle;
  final String citationId;
  final double? confidence;
  final String? locator;
  final String? publisherName;
  final DateTime? retrievedAt;
  final String sourceName;
  final String? verification;

  factory LocalityEvidenceRef.fromJson(Map<String, dynamic> json) => _$LocalityEvidenceRefFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityEvidenceRefToJson(this);
}
