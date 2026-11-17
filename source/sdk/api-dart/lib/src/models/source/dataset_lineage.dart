import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/source/lineage_role.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/captures.dart';
import 'package:mzizi_api/src/models/source/datasets.dart';
import 'package:mzizi_api/src/models/source/documents.dart';

part 'dataset_lineage.g.dart';

/// What a dataset was prepared from: a capture, a document or another dataset, with the role and method.
@JsonSerializable(includeIfNull: false)
class SourceDatasetLineage {
  const SourceDatasetLineage({
    required this.createdAt,
    required this.datasetId,
    this.deletedAt,
    required this.id,
    this.inputCaptureId,
    this.inputDatasetId,
    this.inputDocumentId,
    this.method,
    required this.role,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final String datasetId;
  final DateTime? deletedAt;
  final String id;
  final String? inputCaptureId;
  final String? inputDatasetId;
  final String? inputDocumentId;
  final String? method;
  final SourceLineageRole role;
  final DateTime updatedAt;
  final int version;

  factory SourceDatasetLineage.fromJson(Map<String, dynamic> json) => _$SourceDatasetLineageFromJson(json);

  Map<String, dynamic> toJson() => _$SourceDatasetLineageToJson(this);
}
