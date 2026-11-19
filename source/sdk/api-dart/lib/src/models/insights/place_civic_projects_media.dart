import 'package:json_annotation/json_annotation.dart';

part 'place_civic_projects_media.g.dart';

/// Place Civic Projects Media
@JsonSerializable(includeIfNull: false)
class InsightsPlaceCivicProjectsMedia {
  const InsightsPlaceCivicProjectsMedia({
    this.embedUrl,
    required this.kind,
    this.mimeType,
    required this.platform,
    required this.stored,
    this.thumbnailUrl,
    required this.title,
    required this.url,
  });
  final String? embedUrl;
  final String kind;
  final String? mimeType;
  final String platform;
  final bool stored;
  final String? thumbnailUrl;
  final String title;
  final String url;

  factory InsightsPlaceCivicProjectsMedia.fromJson(Map<String, dynamic> json) => _$InsightsPlaceCivicProjectsMediaFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceCivicProjectsMediaToJson(this);
}
