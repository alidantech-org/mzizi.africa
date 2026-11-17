import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/models/filesystem/file_versions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/artifacts.dart';
import 'package:mzizi_api/src/models/source/captures.dart';
import 'package:mzizi_api/src/models/source/editions.dart';
import 'package:mzizi_api/src/models/source/products.dart';

part 'relationships.g.dart';

/// A classified connection from an input to an output or a domain record: derivation, extraction, translation, support. Exact locations are citations on the relationship.
@JsonSerializable(includeIfNull: false)
class SourceRelationships {
  const SourceRelationships({
    required this.createdAt,
    this.deletedAt,
    this.executionRef,
    required this.id,
    this.inputArtifactId,
    this.inputCaptureId,
    this.inputEditionId,
    this.inputFileVersionId,
    this.inputProductId,
    required this.kindId,
    this.method,
    this.outputArtifactId,
    this.outputCaptureId,
    this.outputEditionId,
    this.outputFileVersionId,
    this.outputProductId,
    this.subjectId,
    this.subjectTable,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? executionRef;
  final String id;
  final String? inputArtifactId;
  final String? inputCaptureId;
  final String? inputEditionId;
  final String? inputFileVersionId;
  final String? inputProductId;
  final String kindId;
  final String? method;
  final String? outputArtifactId;
  final String? outputCaptureId;
  final String? outputEditionId;
  final String? outputFileVersionId;
  final String? outputProductId;
  final String? subjectId;
  final SharedSubjectTable? subjectTable;
  final DateTime updatedAt;
  final int version;

  factory SourceRelationships.fromJson(Map<String, dynamic> json) => _$SourceRelationshipsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceRelationshipsToJson(this);
}
