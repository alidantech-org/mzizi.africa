import 'package:json_annotation/json_annotation.dart';

part 'project_detail_media.g.dart';

/// Project Detail Media
@JsonSerializable(includeIfNull: false)
class InsightsProjectDetailMedia {
  const InsightsProjectDetailMedia({
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

  factory InsightsProjectDetailMedia.fromJson(Map<String, dynamic> json) => _$InsightsProjectDetailMediaFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsProjectDetailMediaToJson(this);
}
