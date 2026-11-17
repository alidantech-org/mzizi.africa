import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/captures.dart';
import 'package:mzizi_api/src/models/source/datasets.dart';
import 'package:mzizi_api/src/models/source/documents.dart';

part 'provenance.g.dart';

/// Where a record in any table came from. The loader writes one row for every seeded record, so a record's origin is a query: its dataset, the lines of the CSV and the inputs the dataset came from.
@JsonSerializable(includeIfNull: false)
class SourceProvenance {
  const SourceProvenance({
    this.captureId,
    this.columnName,
    required this.createdAt,
    required this.datasetId,
    this.deletedAt,
    this.documentId,
    required this.id,
    this.line,
    required this.recordId,
    required this.tableName,
    required this.updatedAt,
    required this.version,
  });
  final String? captureId;
  final String? columnName;
  final DateTime createdAt;
  final String datasetId;
  final DateTime? deletedAt;
  final String? documentId;
  final String id;
  final int? line;
  final String recordId;
  final String tableName;
  final DateTime updatedAt;
  final int version;

  factory SourceProvenance.fromJson(Map<String, dynamic> json) => _$SourceProvenanceFromJson(json);

  Map<String, dynamic> toJson() => _$SourceProvenanceToJson(this);
}
