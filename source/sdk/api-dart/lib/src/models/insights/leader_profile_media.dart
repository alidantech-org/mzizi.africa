import 'package:json_annotation/json_annotation.dart';

part 'leader_profile_media.g.dart';

/// Leader Profile Media
@JsonSerializable(includeIfNull: false)
class InsightsLeaderProfileMedia {
  const InsightsLeaderProfileMedia({
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

  factory InsightsLeaderProfileMedia.fromJson(Map<String, dynamic> json) => _$InsightsLeaderProfileMediaFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderProfileMediaToJson(this);
}
