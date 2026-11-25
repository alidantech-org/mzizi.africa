import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/media/asset_kind.dart';
import 'package:mzizi_api/src/enums/media/availability.dart';
import 'package:mzizi_api/src/models/filesystem/versions.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'assets.g.dart';

/// A photo, logo, flag, video, audio or scan: held bytes or an external link or embed.
@JsonSerializable(includeIfNull: false)
class MediaAssets {
  const MediaAssets({
    this.author,
    this.availability,
    this.capturedOn,
    this.checkedAt,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.duration,
    this.embedUrl,
    this.endSecond,
    this.externalId,
    this.externalUrl,
    this.height,
    required this.id,
    required this.kind,
    required this.kindTerm,
    this.licenceTerm,
    this.providerTerm,
    this.publishedOn,
    this.startSecond,
    this.thumbnailUrl,
    required this.updatedAt,
    required this.version,
    this.versionId,
    this.width,
  });
  final String? author;
  final MediaAvailability? availability;
  final DateTime? capturedOn;
  final DateTime? checkedAt;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final double? duration;
  final String? embedUrl;
  final double? endSecond;
  final String? externalId;
  final String? externalUrl;
  final int? height;
  final String id;
  final MediaAssetKind kind;
  final String kindTerm;
  final String? licenceTerm;
  final String? providerTerm;
  final DateTime? publishedOn;
  final double? startSecond;
  final String? thumbnailUrl;
  final DateTime updatedAt;
  final int version;
  final String? versionId;
  final int? width;

  factory MediaAssets.fromJson(Map<String, dynamic> json) => _$MediaAssetsFromJson(json);

  Map<String, dynamic> toJson() => _$MediaAssetsToJson(this);
}
