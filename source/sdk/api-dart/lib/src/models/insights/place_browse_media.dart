import 'package:json_annotation/json_annotation.dart';

part 'place_browse_media.g.dart';

/// Place Browse Media
@JsonSerializable(includeIfNull: false)
class InsightsPlaceBrowseMedia {
  const InsightsPlaceBrowseMedia({
    this.embedUrl,
    required this.kind,
    this.mimeType,
    this.platform,
    required this.stored,
    this.thumbnailUrl,
    required this.title,
    required this.url,
  });
  final String? embedUrl;
  final String kind;
  final String? mimeType;
  final String? platform;
  final bool stored;
  final String? thumbnailUrl;
  final String title;
  final String url;

  factory InsightsPlaceBrowseMedia.fromJson(Map<String, dynamic> json) => _$InsightsPlaceBrowseMediaFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceBrowseMediaToJson(this);
}
