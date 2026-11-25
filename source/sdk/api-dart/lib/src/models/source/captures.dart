import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/partitioned_record.dart';
import 'package:mzizi_api/src/models/source/artifacts.dart';
import 'package:mzizi_api/src/models/source/paths.dart';
import 'package:mzizi_api/src/models/source/sources.dart';

part 'captures.g.dart';

/// One fetch of a path.
@JsonSerializable(includeIfNull: false)
class SourceCaptures {
  const SourceCaptures({
    this.artifactId,
    this.contentType,
    required this.createdAt,
    this.discoveredAt,
    this.discoveryId,
    this.etag,
    required this.id,
    this.lastModified,
    required this.originalUrl,
    this.pathId,
    required this.retrievedAt,
    this.retrievedUrl,
    this.sourceId,
    this.statusCode,
  });
  final String? artifactId;
  final String? contentType;
  final DateTime createdAt;
  final DateTime? discoveredAt;
  final String? discoveryId;
  final String? etag;
  final String id;
  final DateTime? lastModified;
  final String originalUrl;
  final String? pathId;
  final DateTime retrievedAt;
  final String? retrievedUrl;
  final String? sourceId;
  final int? statusCode;

  factory SourceCaptures.fromJson(Map<String, dynamic> json) => _$SourceCapturesFromJson(json);

  Map<String, dynamic> toJson() => _$SourceCapturesToJson(this);
}
