import 'package:json_annotation/json_annotation.dart';

part 'search_hit.g.dart';

/// Search Hit
@JsonSerializable(includeIfNull: false)
class InsightsSearchHit {
  const InsightsSearchHit({
    this.code,
    this.featureId,
    required this.id,
    this.imageUrl,
    required this.kind,
    required this.kindLabel,
    required this.path,
    this.subtitle,
    required this.title,
  });
  final String? code;
  final String? featureId;
  final String id;
  final String? imageUrl;
  final String kind;
  final String kindLabel;
  final List<String> path;
  final String? subtitle;
  final String title;

  factory InsightsSearchHit.fromJson(Map<String, dynamic> json) => _$InsightsSearchHitFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsSearchHitToJson(this);
}
