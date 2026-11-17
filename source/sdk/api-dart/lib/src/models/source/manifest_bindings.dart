import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/manifest_releases.dart';
import 'package:mzizi_api/src/models/source/sources.dart';

part 'manifest_bindings.g.dart';

/// Dated release binding; activation never changes releases already pinned by running jobs.
@JsonSerializable(includeIfNull: false)
class SourceManifestBindings {
  const SourceManifestBindings({
    required this.activatedAt,
    required this.createdAt,
    this.deactivatedAt,
    this.deletedAt,
    required this.effectiveFrom,
    this.effectiveUntil,
    required this.id,
    required this.manifestReleaseId,
    required this.sourceId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime activatedAt;
  final DateTime createdAt;
  final DateTime? deactivatedAt;
  final DateTime? deletedAt;
  final DateTime effectiveFrom;
  final DateTime? effectiveUntil;
  final String id;
  final String manifestReleaseId;
  final String sourceId;
  final DateTime updatedAt;
  final int version;

  factory SourceManifestBindings.fromJson(Map<String, dynamic> json) => _$SourceManifestBindingsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceManifestBindingsToJson(this);
}
