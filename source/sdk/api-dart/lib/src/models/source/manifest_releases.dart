import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/source/release_status.dart';
import 'package:mzizi_api/src/models/filesystem/file_versions.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/manifests.dart';

part 'manifest_releases.g.dart';

/// Pinned approved manifest content; schema and capabilities are immutable release inputs.
@JsonSerializable(includeIfNull: false)
class SourceManifestReleases {
  const SourceManifestReleases({
    required this.approvedAt,
    required this.approvedBySnapshot,
    required this.contentHash,
    required this.createdAt,
    this.deletedAt,
    required this.effectiveFrom,
    this.effectiveUntil,
    required this.fileVersionId,
    required this.id,
    required this.inputSchemaCode,
    required this.inputSchemaVersion,
    required this.manifestId,
    required this.releaseLabel,
    required this.requiredCapabilities,
    required this.status,
    required this.updatedAt,
    required this.version,
  });
  final DateTime approvedAt;
  final String approvedBySnapshot;
  final String contentHash;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime effectiveFrom;
  final DateTime? effectiveUntil;
  final String fileVersionId;
  final String id;
  final String inputSchemaCode;
  final String inputSchemaVersion;
  final String manifestId;
  final String releaseLabel;
  final String requiredCapabilities;
  final SourceReleaseStatus status;
  final DateTime updatedAt;
  final int version;

  factory SourceManifestReleases.fromJson(Map<String, dynamic> json) => _$SourceManifestReleasesFromJson(json);

  Map<String, dynamic> toJson() => _$SourceManifestReleasesToJson(this);
}
