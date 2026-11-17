import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/artifacts.dart';
import 'package:mzizi_api/src/models/source/captures.dart';
import 'package:mzizi_api/src/models/source/relationships.dart';

part 'citations.g.dart';

/// Exact locator in one artifact: PDF page or paragraph, JSON path, CSV line and column, region or timestamp.
@JsonSerializable(includeIfNull: false)
class SourceCitations {
  const SourceCitations({
    required this.artifactId,
    this.captureId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.locator,
    required this.locatorKindId,
    this.quotedHash,
    required this.recordedAt,
    this.relationshipId,
    required this.updatedAt,
    required this.version,
  });
  final String artifactId;
  final String? captureId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String locator;
  final String locatorKindId;
  final String? quotedHash;
  final DateTime recordedAt;
  final String? relationshipId;
  final DateTime updatedAt;
  final int version;

  factory SourceCitations.fromJson(Map<String, dynamic> json) => _$SourceCitationsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceCitationsToJson(this);
}
