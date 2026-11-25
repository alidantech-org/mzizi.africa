import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/media/asset_kind.dart';
import 'package:mzizi_api/src/models/media/use_entry_captions.dart';

part 'use_entry.g.dart';

/// Use Entry
@JsonSerializable(includeIfNull: false)
class MediaUseEntry {
  const MediaUseEntry({
    required this.assetId,
    required this.captions,
    this.embedUrl,
    this.externalUrl,
    this.height,
    required this.kind,
    required this.kindTerm,
    this.position,
    required this.purposeTerm,
    this.s3Key,
    this.thumbnailUrl,
    this.width,
  });
  final String assetId;
  final List<MediaUseEntryCaptions> captions;
  final String? embedUrl;
  final String? externalUrl;
  final int? height;
  final MediaAssetKind kind;
  final String kindTerm;
  final int? position;
  final String purposeTerm;
  final String? s3Key;
  final String? thumbnailUrl;
  final int? width;

  factory MediaUseEntry.fromJson(Map<String, dynamic> json) => _$MediaUseEntryFromJson(json);

  Map<String, dynamic> toJson() => _$MediaUseEntryToJson(this);
}
