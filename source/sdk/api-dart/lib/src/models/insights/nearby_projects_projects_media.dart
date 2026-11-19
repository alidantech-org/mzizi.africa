import 'package:json_annotation/json_annotation.dart';

part 'nearby_projects_projects_media.g.dart';

/// Nearby Projects Projects Media
@JsonSerializable(includeIfNull: false)
class InsightsNearbyProjectsProjectsMedia {
  const InsightsNearbyProjectsProjectsMedia({
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

  factory InsightsNearbyProjectsProjectsMedia.fromJson(Map<String, dynamic> json) => _$InsightsNearbyProjectsProjectsMediaFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsNearbyProjectsProjectsMediaToJson(this);
}
