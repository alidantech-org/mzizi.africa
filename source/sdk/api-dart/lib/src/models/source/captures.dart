import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/documents.dart';
import 'package:mzizi_api/src/models/source/manifest_releases.dart';
import 'package:mzizi_api/src/models/source/paths.dart';
import 'package:mzizi_api/src/models/source/sources.dart';

part 'captures.g.dart';

/// One retrieval of a path by a source: when, from which link, with what response. The content is a document, shared by every capture of the same bytes; failed requests remain in Operations.
@JsonSerializable(includeIfNull: false)
class SourceCaptures {
  const SourceCaptures({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.documentId,
    required this.id,
    this.manifestReleaseId,
    required this.originalUrl,
    this.pathId,
    required this.responseMetadata,
    required this.retrievedAt,
    this.retrievedUrl,
    required this.sourceId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? documentId;
  final String id;
  final String? manifestReleaseId;
  final String originalUrl;
  final String? pathId;
  final String responseMetadata;
  final DateTime retrievedAt;
  final String? retrievedUrl;
  final String sourceId;
  final DateTime updatedAt;
  final int version;

  factory SourceCaptures.fromJson(Map<String, dynamic> json) => _$SourceCapturesFromJson(json);

  Map<String, dynamic> toJson() => _$SourceCapturesToJson(this);
}
