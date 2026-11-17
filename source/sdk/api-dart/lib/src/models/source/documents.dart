import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/filesystem/file_versions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/publishers.dart';

part 'documents.g.dart';

/// A distinct piece of content identified by its sha256. The same file fetched from many sources is one document with many captures.
@JsonSerializable(includeIfNull: false)
class SourceDocuments {
  const SourceDocuments({
    required this.code,
    this.contentType,
    required this.createdAt,
    this.deletedAt,
    this.fileVersionId,
    required this.id,
    required this.kindId,
    this.parentId,
    this.publishedOn,
    this.publisherId,
    required this.sha256,
    this.sizeBytes,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? contentType;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? fileVersionId;
  final String id;
  final String kindId;
  final String? parentId;
  final DateTime? publishedOn;
  final String? publisherId;
  final String sha256;
  final int? sizeBytes;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory SourceDocuments.fromJson(Map<String, dynamic> json) => _$SourceDocumentsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceDocumentsToJson(this);
}
