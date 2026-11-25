import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/artifacts.dart';
import 'package:mzizi_api/src/models/source/paths.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'citations.g.dart';

/// Exactly where in an artifact or capture a fact is.
@JsonSerializable(includeIfNull: false)
class SourceCitations {
  const SourceCitations({
    this.artifactId,
    this.captureId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.locator,
    required this.locatorTerm,
    this.pathId,
    this.quotedHash,
    required this.recordedAt,
    this.retrievedAt,
    required this.updatedAt,
    required this.version,
  });
  final String? artifactId;
  final String? captureId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String locator;
  final String locatorTerm;
  final String? pathId;
  final String? quotedHash;
  final DateTime recordedAt;
  final DateTime? retrievedAt;
  final DateTime updatedAt;
  final int version;

  factory SourceCitations.fromJson(Map<String, dynamic> json) => _$SourceCitationsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceCitationsToJson(this);
}
