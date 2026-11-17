import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/filesystem/file_versions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/captures.dart';
import 'package:mzizi_api/src/models/source/documents.dart';
import 'package:mzizi_api/src/models/source/evidence.dart';

part 'citations.g.dart';

/// Exact locator in immutable bytes: PDF page/paragraph, JSON path, CSV row/column, region, timestamp or dataset record.
@JsonSerializable(includeIfNull: false)
class SourceCitations {
  const SourceCitations({
    this.captureId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.documentId,
    required this.evidenceId,
    required this.fileVersionId,
    required this.id,
    required this.locator,
    required this.locatorKindId,
    this.quotedHash,
    required this.recordedAt,
    required this.updatedAt,
    required this.version,
  });
  final String? captureId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? documentId;
  final String evidenceId;
  final String fileVersionId;
  final String id;
  final String locator;
  final String locatorKindId;
  final String? quotedHash;
  final DateTime recordedAt;
  final DateTime updatedAt;
  final int version;

  factory SourceCitations.fromJson(Map<String, dynamic> json) => _$SourceCitationsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceCitationsToJson(this);
}
