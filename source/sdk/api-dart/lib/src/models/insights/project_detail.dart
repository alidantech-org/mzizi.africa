import 'package:json_annotation/json_annotation.dart';

part 'project_detail.g.dart';

/// Project Detail
@JsonSerializable(includeIfNull: false)
class InsightsProjectDetail {
  const InsightsProjectDetail({
    required this.evidence,
    required this.gaps,
    required this.media,
    required this.money,
    this.procurement,
    required this.project,
  });
  final List<Object?> evidence;
  final List<String> gaps;
  final List<Object?> media;
  final List<Object?> money;
  final Object? procurement;
  final Object? project;

  factory InsightsProjectDetail.fromJson(Map<String, dynamic> json) => _$InsightsProjectDetailFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsProjectDetailToJson(this);
}
