import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/source/dataset_assembly.dart';
import 'package:mzizi_api/src/models/filesystem/file_versions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'datasets.g.dart';

/// A dataset we hold, most often a seed CSV that rows are loaded from: categorised, hashed, and either taken as downloaded or assembled from other inputs.
@JsonSerializable(includeIfNull: false)
class SourceDatasets {
  const SourceDatasets({
    required this.assembly,
    this.categoryId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.description,
    this.fileVersionId,
    required this.format,
    required this.id,
    this.location,
    this.sha256,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final SourceDatasetAssembly assembly;
  final String? categoryId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final String? fileVersionId;
  final String format;
  final String id;
  final String? location;
  final String? sha256;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory SourceDatasets.fromJson(Map<String, dynamic> json) => _$SourceDatasetsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceDatasetsToJson(this);
}
